class TimeControl {
    constructor({
        name = '',
        rating = 0,
        highestRating = 0,
        winCount = 0,
        lossCount = 0,
        drawCount = 0
    } = {}) {
        this.name = name;
        this.rating = rating;
        this.highestRating = highestRating;
        this.winCount = winCount;
        this.lossCount = lossCount;
        this.drawCount = drawCount;
    }

    hasGames() {
        return this.totalGamesCount() > 0;
    }

    totalGamesCount() {
        return this.winCount + this.lossCount + this.drawCount;
    }

    getTitleString() {
        const capitalizedName = this.name.charAt(0).toUpperCase() + this.name.slice(1);
        return `${capitalizedName}`;
    }

    getRatingString() {
        if (!this.hasGames()) return 'No games played';
        return `
            Rating: ${this.rating} (${this.highestRating})
            W: ${this.winCount}
            L: ${this.lossCount}
            D: ${this.drawCount}
        `
    }
}

class ChessProfile {
    constructor({
        stats = [],
        name = null,
        avatar = null,
        title = null,
        fide = null
    } = {}) {
        this.name = name;
        this.avatar = avatar;
        this.title = title;
        this.fide = fide;
        this.bullet = new TimeControl();
        this.blitz = new TimeControl();
        this.rapid = new TimeControl();

        this.setTimeControls(stats);
    }

    setTimeControls(stats) {
        stats.forEach(s => {
            this[s.name] = s;
        });
    }

    getFideRating() {
        if (this.fide) {
            return `Rating: ${this.fide} \n Title: ${this.title ? this.title : '—'}`
        }

        return '—';
    }
}

module.exports = {
    TimeControl,
    ChessProfile
}