const { v4: uuidv4 } = require("uuid")

module.exports = class Poll {
    constructor({ question, options }) {
        this.id = uuidv4()

        this.question = question

        this.options = []

        for (const option of options) {
            this.options.push({
                option, votes: new Set()
            })
        }

        this.votedPeer = new Map()

        this.timestamp = Date.now()

        this.isClosed = false
    }

    vote(peerId, optionIndex) {
        if (this.isClosed)
            return null

        const option = this.options[optionIndex]

        if (option) {
            option.votes.add(peerId)
            this.votedPeer.set(peerId, optionIndex)
            return option
        }

        return null;
    }

    getInfo(peerId) {
        return {
            id: this.id,
            question: this.question,
            timestamp: this.timestamp,
            options: this.options.map(option => ({ ...option, votes: option.votes.size })),
            voted: this.votedPeer.get(peerId),
            isClosed: this.isClosed
        }
    }
}