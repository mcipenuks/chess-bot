const axios = require('axios');
const BASE_URL = 'https://chess.com/callback/member/stats/';

const fetchUser = async (name) => {
    let res = await axios.get(BASE_URL + name);
    return {
        stats: res.data.stats,
        fide: res.data.officialRating ? res.data.officialRating.rating : null
    }
}

const ChessUser = async (name) => {
    let user = await fetchUser(name);

    const state = {
        bullet: null,
        lightning: null,
        rapid: null,
        fide: user.fide,

        ratingString: (type) => {
            if (!state[type]) return '—';
            return `Rating: ${state[type].rating} \n (W: ${state[type].win}/L: ${state[type].loss}/D: ${state[type].draw})`
        },

        ratingFIDE: () => {
            return state.fide ? `Rating: ${state.fide}` : '—';
        }
    }

    let useful = ['bullet', 'lightning', 'rapid'];
    let filtered = user.stats.filter(s => useful.includes(s.key));

    filtered.forEach(f => {
        state[f.key] = {};
        state[f.key].rating = f.stats.rating;
        state[f.key].highestRating = f.stats.highest_rating;
        state[f.key].games = f.gameCount;
        state[f.key].win = f.stats.total_win_count;
        state[f.key].loss = f.stats.total_loss_count;
        state[f.key].draw = f.stats.total_draw_count;
    });

    return state;
}

module.exports = ChessUser;
