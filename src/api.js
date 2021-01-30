const axios = require('axios');
const {TimeControl, ChessProfile} = require('./bot');

const BASE_URL = 'https://api.chess.com/pub';
const DEFAULT_AVATAR = 'https://betacssjs.chesscomfiles.com/bundles/web/images/noavatar_l.84a92436.gif';

const fetchPlayer = async (username) => {
    const res = (await axios.get(BASE_URL + `/player/${username}`)).data;
    const name = res.url.replace('https://www.chess.com/member/', '').trim();
    const avatar = res.avatar ? res.avatar : DEFAULT_AVATAR;
    const title = res.title ? res.title : null;

    return {name, avatar, title}
}

const fetchStats = async (username) => {
    const res = (await axios.get(BASE_URL + `/player/${username}/stats`)).data;
    const stats = mapStats(res);
    const fide = res.fide ? res.fide : null;

    return {stats, fide}
}


const getProfile = async (name) => {
    const player = await fetchPlayer(name);
    const stats = await fetchStats(name);

    return new ChessProfile({
        stats: stats.stats,
        name: player.name,
        avatar: player.avatar,
        title: player.title,
        fide: stats.fide
    });
}

const mapStats = (stats) => {
    const timeControls = ['chess_bullet', 'chess_blitz', 'chess_rapid'];
    return timeControls.map(t => {
        const name = t.substr(6);
        if (!stats[t]) return new TimeControl({name});
        return new TimeControl({
            name,
            rating: stats[t].last.rating,
            highestRating: stats[t].best.rating,
            winCount: stats[t].record.win,
            lossCount: stats[t].record.loss,
            drawCount: stats[t].record.draw
        })
    });
}

module.exports = {
    getProfile
}