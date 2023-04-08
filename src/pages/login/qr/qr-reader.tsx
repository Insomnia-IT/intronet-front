import QrScanner from "qr-scanner";
import React from "preact";
import style from "./qr.module.css";
import { pdf2png } from "./pdf2png";
import {TargetedEvent} from "preact/compat";
import {SvgIcon} from "@icons";

export class QRReader extends React.Component<
  {
    fps?: number;
    qrbox?;
    aspectRatio?: number;
    disableFlip?: boolean;
    verbose?: boolean;
    onSuccess(string);
    onError(error);
  },
  { camera: boolean; result?: string; valid?: boolean; value?: string }
> {
  private config = Object.assign(
    {
      fps: 60,
      qrbox: null,
      aspectRatio: 1,
      disableFlip: false,
      supportedScanTypes: [],
    },
    this.props
  );
  private reader: QrScanner;
  state = {
    camera: false,
    result: null,
    valid: false,
    value: "",
  };

  videoRef = React.createRef<HTMLVideoElement>();

  render() {
    return (
      <div className={style.container}>
        <div>
          <label>Войти по номеру билета</label>
          <input
            type="number"
            placeholder={"17 цифр"}
            onChange={this.OnInput}
            onClick={this.StopCamera}
          />
          {this.state.valid && (
            <button
              className={style.button}
              onClick={() => this.props.onSuccess(this.state.value)}
            >
            </button>
          )}
        </div>
        <div>
          <video ref={this.videoRef} />
        </div>
        <div style={{ gap: "1em" }}>
          <label onClick={this.StopCamera} className={style.fileButton}>
            <SvgIcon id="#add" />
            <span>Войти по билету</span>
            <input type="file" onChange={this.ScanFile} />
          </label>
          <button className={style.button} onClick={this.ToggleCamera}>
            {this.state.camera ? "Отключить камеру" : "Сканировать QR-код"}
          </button>
        </div>
      </div>
    );
  }

  ScanFile = async (e: TargetedEvent<HTMLInputElement>) => {
    try {
      const file = e.currentTarget.files[0];
      console.log(file.name);
      const img = file.name.endsWith(".pdf") ? await pdf2png(file) : file;
      const res = await QrScanner.scanImage(img, {
        alsoTryWithoutScanRegion: true,
      });
      this.onSuccess(res);
    } catch (e) {
      this.onError(e);
    }
    e.currentTarget.value = null;
    // const res = await this.reader.scanFile(e.target.files[0]);
    // const res = await this.reader.start(camera, this.config, this.onSuccess, console.log);
  };

  componentWillUnmount() {
    this.StopCamera();
  }

  StopCamera = () => this.state.camera && this.ToggleCamera();
  ToggleCamera = async () => {
    this.setState((state) => ({
      camera: !state.camera,
    }));
    if (this.reader) {
      this.reader.stop();
      this.reader = null;
      return;
    }
    this.reader = new QrScanner(
      this.videoRef.current,
      (res) => {
        this.ToggleCamera();
        this.onSuccess(res);
      },
      {
        highlightCodeOutline: true,
        highlightScanRegion: true,
      }
    );
    await this.reader.start();
    // if (this.state.camera) {
    //   this.setState({camera: false});
    //   this.reader.stop();
    //   return;
    // }
    // this.setState({camera: true})
  };

  onSuccess = async (result) => {
    const data = result.data as string;
    this.setState({
      result: data,
    });
    this.props.onSuccess(data);
  };

  OnInput = (e) => {
    const value = e.target.value;
    this.setState({
      valid: /^\d{13}$/.test(value),
      value,
    });
  };

  onError = async (error) => {
    this.props.onError(error);
  };
}
