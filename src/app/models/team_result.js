import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var TeamResultSchema = new Schema({
    team: { type: String, unique: true },
    eventId: { type: String }
});

TeamResultSchema.path('team').required(true, "Team name can't be blank");

TeamResultSchema.statics = {
    load(id) {
        return this.findOne({ team: id });
    }
}

mongoose.model('TeamResult', TeamResultSchema);
