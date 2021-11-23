module.exports = class Question {
    constructor({ user, question }) {
        this.question = question
        this.timestamp = Date.now()
        this.reply = null
    }

    answerQuestion(content){
        
    }
}