import mongoose from 'mongoose';

const UrlModel = mongoose.model('Url',{
    url: String,
    code: String,
    ip: String,
    date: Date
});

export default UrlModel;
