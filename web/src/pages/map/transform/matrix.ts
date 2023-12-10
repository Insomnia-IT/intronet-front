export class Matrix {
  private A00 = 1;
  private A01 = 0;
  private A10 = 0;
  private A11 = 1;

  public Invoke(p: IPoint) {
    return {
      X: p.X * this.A00 + p.Y * this.A01,
      Y: p.X * this.A10 + p.Y * this.A11,
    };
  }

  public GetScaleFactor() {
    if (this.A10 === 0 && this.A01 === 0 && this.A00 === this.A11)
      return this.A00;
    return Math.sqrt(this.A00 * this.A11 - this.A01 * this.A10);
  }

  public Ortogonalize() {
    this.A11 = this.A00;
    this.A01 = -this.A10;
  }

  public Transpose() {
    const result = new Matrix();
    result.A00 = this.A00;
    result.A11 = this.A11;
    result.A10 = this.A01;
    result.A01 = this.A10;
    return result;
  }

  public Inverse(): Matrix {
    const result = new Matrix();
    const det = this.A00 * this.A11 - this.A10 * this.A01;
    result.A00 = this.A11 / det;
    result.A01 = -this.A01 / det;
    result.A10 = -this.A10 / det;
    result.A11 = this.A00 / det;
    return result;
  }

  public IsIdentity(): boolean {
    return this.A00 === 1 && this.A10 === 0 && this.A01 === 0 && this.A11 === 1;
  }

  Multiple(matrix: Matrix) {
    const result = new Matrix();
    result.A00 = this.A00 * matrix.A00 + this.A01 * matrix.A10;
    result.A01 = this.A00 * matrix.A01 + this.A01 * matrix.A11;
    result.A10 = this.A10 * matrix.A00 + this.A11 * matrix.A10;
    result.A11 = this.A10 * matrix.A01 + this.A11 * matrix.A11;
    return result;
  }

  public static Rotate(rad): Matrix {
    const result = new Matrix();
    result.A00 = Math.cos(rad);
    result.A01 = -Math.sin(rad);
    result.A10 = Math.sin(rad);
    result.A11 = Math.cos(rad);
    return result;
  }

  public static Scale(kx, ky = kx): Matrix {
    const result = new Matrix();
    result.A00 = kx;
    result.A11 = ky;
    return result;
  }

  public toString() {
    return this.A00 + ", " + this.A10 + ", " + this.A01 + ", " + this.A11;
  }

  public ToString() {
    if (this.A01 === 0 && this.A10 === 0) {
      return this.ToScale();
    }
    return "matrix(" + this.toString() + ")";
  }

  public ToScale() {
    return `scale(${this.A00}, ${this.A11})`;
  }

  static Equal(m1: Matrix, m2: Matrix) {
    return (
      Math.abs(m1.A00 - m2.A00) < 0.0001 &&
      Math.abs(m1.A01 - m2.A01) < 0.0001 &&
      Math.abs(m1.A10 - m2.A10) < 0.0001 &&
      Math.abs(m1.A11 - m2.A11) < 0.0001
    );
  }

  ToJSON() {
    return [this.A00, this.A10, this.A01, this.A11];
  }

  FromJSON(dto: number[]) {
    this.A00 = dto[0];
    this.A10 = dto[1];
    this.A01 = dto[2];
    this.A11 = dto[3];
  }
}

export type IPoint = {
  X: number;
  Y: number;
};
