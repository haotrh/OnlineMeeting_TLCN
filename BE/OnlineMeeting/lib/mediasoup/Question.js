const { v4: uuidv4 } = require("uuid")
const UserService = require("../../services/user.service")

module.exports = class Question {
    constructor({ peerId, question }) {
        this.id = uuidv4()

        this.question = question

        this.timestamp = Date.now()

        this.reply = null

        this.peerId = peerId

        this.upvotes = new Set()

        this.isClosed = false
    }

    answerQuestion(answer) {
        this.reply = {
            answer,
            timestamp: Date.now()
        }

        this.isClosed = true
    }

    upvote(peerId) {
        if (this.upvotes.has(peerId)) {
            this.upvotes.delete(peerId)
        } else {
            this.upvotes.add(peerId)
        }
    }

    getUpvote() {
        return this.upvotes.size;
    }

    getIsVoted(peerId) {
        return this.upvotes.has(peerId)
    }

    async getInfo(peerId) {
        return {
            id: this.id,
            question: this.question,
            timestamp: this.timestamp,
            reply: this.reply,
            upvotes: this.upvotes.size,
            user: await UserService.getUserById(this.peerId),
            isClosed: this.isClosed,
            isVoted: peerId ? this.upvotes.has(peerId) : false
        }
    }
}