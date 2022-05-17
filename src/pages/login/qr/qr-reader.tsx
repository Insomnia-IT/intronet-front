import QrScanner from 'qr-scanner';
import React, {ChangeEvent} from 'react';
import style from "./qr.module.css";
import * as Bulma from "react-bulma-components";
import {pdf2png} from "./pdf2png";

export class QRReader extends React.Component<{
  fps?: number;
  qrbox?,
  aspectRatio?: number;
  disableFlip?: boolean;
  verbose?: boolean;
  onSuccess(string);
  onError(error);
}, { camera: boolean; result?: string; }> {

  private config = Object.assign({
    fps: 60,
    qrbox: null,
    aspectRatio: 1,
    disableFlip: false,
    supportedScanTypes: [],
  }, this.props)
  private reader: QrScanner;
  state = {
    camera: false,
    result: null
  };

  videoRef = React.createRef<HTMLVideoElement>();

  render() {
    return <div className={style.qrReader}>
      <Bulma.Button renderAs={'label'}
                    onClick={this.StopCamera}
                    className={style.fileButton}>
        <span>Choose file</span>
        <input type="file"
               onChange={this.ScanFile}/>
      </Bulma.Button>
      <Bulma.Form.Control>
        <span>Ticket number</span>
        <Bulma.Form.Input placeholder={'17 цифр'}
                          onChange={this.OnInput}
                          onClick={this.StopCamera}/>
      </Bulma.Form.Control>
      <Bulma.Button onClick={this.ToggleCamera}>{this.state.camera ? 'Stop' : 'Camera'}</Bulma.Button>
      <video ref={this.videoRef}
             style={{display: this.state.camera ? 'initial' : 'none'}}
             className={style.camera}/>
    </div>;
  }

  ScanFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files[0];
      console.log(file.name);
      const img = file.name.endsWith('.pdf')
        ? await pdf2png(file)
        : file;
      const res = await QrScanner.scanImage(img, {
        alsoTryWithoutScanRegion: true,
      });
      this.onSuccess(res);
    } catch (e) {
      this.onError(e);
    }
    e.target.value = null;
    // const res = await this.reader.scanFile(e.target.files[0]);
    // const res = await this.reader.start(camera, this.config, this.onSuccess, console.log);
  };

  StopCamera = () => this.state.camera && this.ToggleCamera();
  ToggleCamera = async () => {
    this.setState(state => ({
      camera: !state.camera
    }));
    if (this.reader)
      return this.reader.stop();
    this.reader = new QrScanner(this.videoRef.current, res => {
      this.ToggleCamera();
      this.onSuccess(res);
    }, {
      highlightCodeOutline: true,
      highlightScanRegion: true,
    });
    await this.reader.start();
    // if (this.state.camera) {
    //   this.setState({camera: false});
    //   this.reader.stop();
    //   return;
    // }
    // this.setState({camera: true})
  };

  onSuccess = async result => {
    const data = result.data as string;
    this.setState({
      result: data
    });
    this.props.onSuccess(data);
  }

  OnInput = e => {
    const value = e.target.value;
    if (/^\d{13}$/.test(value)){
      this.props.onSuccess(value);
    }
  }

  onError = async error => {
    this.props.onError(error);
  }
}
