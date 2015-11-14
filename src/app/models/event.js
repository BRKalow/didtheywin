import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var EventSchema = new Schema({
    eventId: { type: String, unique: true },
    body: { type: Object },
    boxscore: { type: Object }
});

EventSchema.statics = {
    load(id) {
        return this.findOne({ eventId: id });
    }
}

mongoose.model('Event', EventSchema);
