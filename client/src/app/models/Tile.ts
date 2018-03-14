export class Tile {
    tileStyles: any;
    constructor(public used: boolean, public hit: boolean, public row: number, public col: number) {
        Tile.setTileStyles(this, false, false);
    }

    static hide(tile: Tile) {
        if (tile.used) {
            tile.tileStyles = {
                'background-color': 'white',
                'border': '1px solid black',
                'grid-column': `${tile.col} / span 1`,
                'grid-row': ` ${tile.row} / span 1`,
                'padding-bottom': '100%'
            };
        }
    }

    static setTileStyles(tile: Tile, used: boolean, hit: boolean) {
        tile.used = used;
        tile.hit = hit;
        tile.tileStyles = {
            'background-color': tile.used ? 'grey' : 'white',
            'border': tile.hit ? '5px solid red' : '1px solid black',
            'grid-column': `${tile.col} / span 1`,
            'grid-row': ` ${tile.row} / span 1`,
            'padding-bottom': '100%'
        };
    }
}
