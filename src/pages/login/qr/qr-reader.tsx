import QrScanner from 'qr-scanner';
import React, {ChangeEvent} from 'react';
import style from "./qr.module.css";
import * as Bulma from "react-bulma-components";

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
                    onClick={() => this.state.camera && this.ToggleCamera()}
                    className={style.fileButton}>
        <span>Choose file</span>
        <input type="file"
               onChange={this.ScanFile}/>
      </Bulma.Button>
      <Bulma.Button onClick={this.ToggleCamera}>{this.state.camera ? 'Stop' : 'Camera'}</Bulma.Button>
      <video ref={this.videoRef}
             style={{display: this.state.camera ? 'initial' : 'none'}}
             className={style.camera}/>
    </div>;
  }

  ScanFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const res = await QrScanner.scanImage(e.target.files[0], {
        alsoTryWithoutScanRegion: true,
      });
      this.onSuccess(res);
    }catch (e){
      this.onError(e);
    }
    // const res = await this.reader.scanFile(e.target.files[0]);
    // const res = await this.reader.start(camera, this.config, this.onSuccess, console.log);
  };


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

  onError = async error => {

  }


  componentWillUnmount() {

  }

  componentDidMount() {
  }
}
