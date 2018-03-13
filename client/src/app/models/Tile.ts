export class Tile {
    tileStyles: any;
    constructor(public used: boolean, public hit: boolean, public row: number, public col: number) {
        this.tileStyles = {
            'background-color': this.used ? 'white' : 'rgb(157, 157, 165)',
            'border': this.hit ? '1px solid rgb(157, 157, 165)' : 'black',
            'grid-column': `${col} / span 1`,
            'grid-row' : ` ${row} / span 1`
        };
    }

    setTileStyles(used: boolean, hit: boolean) {
        this.used = used;
        this.hit = hit;
        this.tileStyles = {
            'background-color': this.used ? 'white' : 'rgb(157, 157, 165)',
            'border': this.hit ? '1px solid rgb(157, 157, 165)' : 'black',
            'grid-column': `${this.col} / span 1`,
            'grid-row' : ` ${this.row} / span 1`
        };
    }

}
