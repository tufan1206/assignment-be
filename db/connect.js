const mongoose = require ("mongoose");

uri = "mongodb+srv://tufanawon:ASuOlOemtNJQ1zJ8@crudcluster.tdddqms.mongodb.net/CRUDCluster?retryWrites=true&w=majority&appName=CRUDCluster"


const connectDB = () =>{
    return mongoose.connect(uri, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    });
};

module.exports = connectDB ; 