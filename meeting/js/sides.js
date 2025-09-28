class Sides {
  static lSide;
  static rSide;

  static setSides(_lSide, _rSide){
    this.lSide = _lSide;
    this.rSide = _rSide;
  }

  static getOppositeSide(Side){
    return Side.side === "left" ? rSide : lSide;
  }
}