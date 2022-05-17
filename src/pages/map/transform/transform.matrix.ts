import {Matrix, IPoint} from "./matrix";

export class TransformMatrix {

  public Matrix = new Matrix();
  public Shift = {X: 0, Y: 0};

  public Scale(kx, ky = kx) {
    return this.Apply(TransformMatrix.Scale(kx, ky));
  }

  public Translate(p: IPoint): TransformMatrix {
    return this.Apply(TransformMatrix.Translate(p));
  }

  public Rotate(rad) {
    return this.Apply(TransformMatrix.Rotate(rad));
  }

  public RotateDeg(deg) {
    return this.Rotate(deg * Math.PI / 180);
  }

  public Invoke = (p: IPoint) => {
    const s = this.Matrix.Invoke(p);
    return {
      X: s.X + this.Shift.X,
      Y: s.Y + this.Shift.Y,
    };
  };

  public GetTranslatePart() {
    return this.Shift;
  }


  public Inverse(): TransformMatrix {
    const result = new TransformMatrix();
    result.Matrix = this.Matrix.Inverse();
    const s = result.Matrix.Invoke(this.Shift);
    result.Shift = {X: -s.X, Y: -s.Y};
    return result;
  }

  public Apply(matrix: TransformMatrix) {
    const result = new TransformMatrix();
    if (this.Matrix.IsIdentity()) {
      result.Shift = {
        X: this.Shift.X + matrix.Shift.X,
        Y: this.Shift.Y + matrix.Shift.Y
      }
      result.Matrix = matrix.Matrix;
    }
    const s = this.Matrix.Invoke(matrix.Shift);
    result.Shift = {
      X: s.X + this.Shift.X,
      Y: s.Y + this.Shift.Y,
    };
    // result.B0 = this.B0 + matrix.B0 * this.A00 + matrix.B1 * this.A01;
    // result.B1 = this.B1 + matrix.B0 * this.A10 + matrix.B1 * this.A11;
    result.Matrix = this.Matrix.Multiple(matrix.Matrix);
    return result;
  }


  /**
   * Применяет трансформацию перевеодя v1 в v2
   */
  public ApplyWithShift(transform: TransformMatrix, v1: IPoint, v2: IPoint) {
    /*
      mt1'* v1 = p1
      = (m1|s1)' * v1
      = (m2|s2+t)' * v2
      = (m2'|-m2' * (s2+t)) * v2
      = (m2'|-m2' * s2) * v2 - m2'*t
      = (m2|s2)' * v2  - m2' * t
      = p2 - m2' * t
      m2' * t  = p2 - p1
      t = m2 * (p2 - p1)
     */
    const mt2 = this.Apply(transform);
    const mt1i = this.Inverse();
    const mt2i = mt2.Inverse();
    const p1 = mt1i.Invoke(v1);
    const p2 = mt2i.Invoke(v2);
    const shift = {
      X: p2.X - p1.X,
      Y: p2.Y - p1.Y
    }
    // const translate = mt2.Matrix.Invoke(shift);
    const result = mt2.Translate(shift);
    return result;
  }


  public static Rotate(rad): TransformMatrix {
    const result = new TransformMatrix();
    result.Matrix = Matrix.Rotate(rad);
    return result;
  }

  public static Translate(p: IPoint): TransformMatrix {
    const result = new TransformMatrix();
    result.Shift = p;
    return result;
  }

  public static FromJSON(data: number[]) {
    const matrix = new TransformMatrix();
    if (data)
      matrix.FromJSON(data);
    return matrix;
  }

  public static Scale(kx, ky = kx): TransformMatrix {
    const result = new TransformMatrix();
    result.Matrix = Matrix.Scale(kx, ky);
    ;
    return result;
  }

  public static Apply(matrix1: TransformMatrix, matrix2: TransformMatrix): TransformMatrix {
    return new TransformMatrix().Apply(matrix1).Apply(matrix2);
  }

  public Convert(value: number): number {
    return this.Invoke({X: value, Y: 0}).X;
  }

  public toString() {
    return this.Matrix.toString()
      + ', ' + this.Shift.X
      + ', ' + this.Shift.Y;
  }

  public ToJSON(): [number, number, number, number, number, number] {
    return [...this.Matrix.ToJSON(), this.Shift.X, this.Shift.Y] as [number, number, number, number, number, number];
  }

  public FromJSON(dto: number[]) {
    this.Shift = {X: dto[4], Y: dto[5]};
    this.Matrix = new Matrix();
    this.Matrix.FromJSON(dto.slice(0, 4));
  }

  public ToString(type: 'css' | 'svg' = 'css') {
    if (this.Matrix.IsIdentity()) {
      return this.ToTranslate(type);
    }
    return `matrix(${this.toString()})`;
    // return this.Matrix.ToString();
  }

  public ToTranslate3d(type: 'css' | 'svg' = 'css') {
    const unit = type == 'css'  ? 'px' : '';
    return 'translate3d(' + this.Shift.X + `${unit},` + this.Shift.Y + `${unit}, 0)`;
  }

  public ToTranslate(type: 'css' | 'svg' = 'css') {
    const unit = type == 'css'  ? 'px' : '';
    return 'translate(' + this.Shift.X + `${unit},` + this.Shift.Y + `${unit})`;
  }

  public ToTranslateX() {
    return 'translateX(' + this.Shift.X + 'px)';
  }

  public ToScale() {
    return 'scale(' + this.Matrix + ')';
  }

  public ToScaleTranslate() {
    return this.ToScale() + ' ' + this.ToTranslate3d();
  }

}
