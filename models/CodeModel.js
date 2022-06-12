import mongoose from 'mongoose';

const CodeModel = mongoose.model('Code',{
    code: String,
    valid: Boolean,
    a_string: String,
    date: Date
});

export default CodeModel;
