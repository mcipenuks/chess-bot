var dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

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
        username = null,
        name = null,
        country = null,
        avatar = null,
        title = null,
        fide = null,
        lastOnline = dayjs()
    } = {}) {
        this.username = username;
        this.name = name;
        this.avatar = avatar;
        this.country = country,
        this.title = title;
        this.fide = fide;
        this.lastOnline = lastOnline;
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

    getDescription() {
        let description = '';

        if (this.name) description += `${this.name} \n`;
        description += `${this.getLastOnline()} \n`;

        return description;
    }

    getCountryFlag() {
        if (!this.country) return '';
        if (this.country === 'xx') return `:globe_with_meridians:`;
        return `:flag_${this.country.toLowerCase()}:`;
    }

    getLastOnline() {
        const fromNow = dayjs(this.lastOnline * 1000).fromNow();
        return `Last online: ${fromNow}`;
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