// dependency: @types/w3c-web-usb

const filters: USBDeviceFilter[] = [
  { vendorId: 0x239a }, // Adafruit Boards!
  { vendorId: 0x303a }, // Espressif
  { vendorId: 0xcafe }, // Custom
  { vendorId: 0x2341 }, // Arduino
];

export class Serial {
  // check if we already have permission to access any connected devices
  public static async getPorts(): Promise<Port[]> {
    const devices = await navigator.usb.getDevices();
    return devices.map((device) => new Port(device));
  }

  // if this is the first time the user has visited the page then it won’t have permission to access any devices
  public static async requestPort(
    ownFilters?: USBDeviceFilter[]
  ): Promise<Port | null> {
    let device;

    try {
      device = await navigator.usb.requestDevice({
        filters: ownFilters || filters,
      });
    } catch (e) {
      console.log(e);
      // if we don't select any device, this requestDevice throws an error
      return null;
    } finally {
      if (device) {
        return new Port(device);
      }
      return null;
    }
  }
}

export class Port {
  public device_: USBDevice;

  public interfaceNumber_: number;

  public interface: USBInterface;

  public endpointIn: USBEndpoint;

  public endpointOut: USBEndpoint;

  constructor(device: USBDevice) {
    this.device_ = device;
    this.interfaceNumber_ = 2; // interface number defined in webusb arduino library
  }

  public async send(data: BufferSource): Promise<USBOutTransferResult> {
    const result = await this.device_.transferOut(
      this.endpointOut.endpointNumber,
      data
    );
    return result;
  }

  public async disconnect(): Promise<void> {
    await this.device_.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x00,
      index: this.interfaceNumber_,
    });
    await this.device_.close();
    this.interface = null;
    this.endpointIn = null;
    this.endpointOut = null;
  }

  public onReceive = (data: DataView): string => {
    const textDecoder = new TextDecoder();
    return textDecoder.decode(data);
  };

  public async readLoop(): Promise<string> {
    const result = await this.device_.transferIn(
      this.endpointIn.endpointNumber,
      64
    );
    const data = this.onReceive(result.data);
    return data;
  }

  public async connect() {
    console.log(this.device_);
    await this.device_.open();
    if (this.device_.configuration === null) {
      await this.device_.selectConfiguration(1);
    }

    // find the interface which has 0xff interface class as its alternate and its interface number is 0 for esp, 2 for arduino
    this.interface = (this.device_.configuration.interfaces || []).find(
      (c) =>
        !!c.alternates.find((a) => a.interfaceClass === 0xff) &&
        c.interfaceNumber === this.interfaceNumber_
    );
    if (!this.interface) {
      throw new Error("Interface not found");
    }
    const alternate = this.interface.alternates[0];

    this.endpointIn = alternate.endpoints.find((e) => e.direction === "in");
    this.endpointOut = alternate.endpoints.find((e) => e.direction === "out");

    if (!this.endpointIn || !this.endpointOut) {
      throw new Error("Endpoints not found");
    }

    await this.device_.claimInterface(this.interface.interfaceNumber);

    await this.device_.selectAlternateInterface(
      this.interface.interfaceNumber,
      0
    );

    await this.device_.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22,
      value: 0x01,
      index: this.interface.interfaceNumber,
    });
  }
}
