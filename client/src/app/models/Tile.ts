export class Tile {
    tileStyles: any;
    constructor(public used: boolean, public hit: boolean, public row: number, public col: number) {
        this.setTileStyles(false, false);
    }

    setTileStyles(used: boolean, hit: boolean) {
        this.used = used;
        this.hit = hit;
        this.tileStyles = {
            'background-color': this.used ? 'grey' : 'white',
            'border': this.hit ? '1px solid rgb(157, 157, 165)' : '1px solid black',
            'grid-column': `${this.col} / span 1`,
            'grid-row': ` ${this.row} / span 1`,
            'padding-bottom': '100%'
        };
    }

}
