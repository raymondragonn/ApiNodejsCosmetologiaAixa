class APIFeatures {
    constructor(query, queryString){//moogose query and the query string from express of the url
      this.query = query;
      this.queryString = queryString;
    }
    filter(){
      const  queryObj = {...this.queryString};//los tres puntos son para hacer una copia del objeto
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach(el => delete queryObj[el]);
      // console.log(req.query, queryObj);
  
      // 2A) Advanced filtering
      let queryStr = JSON.stringify(queryObj);// gte = greater than or equal. gt = greater than. lte = less than or equal. lt = less than
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);//busca las palabras y solo esas palabras para remplazarlas y g para indicar que ocurrira multiples veces
      
      this.query = this.query.find(JSON.parse(queryStr));
      // let query = Tour.find(JSON.parse(queryStr));
      return this;
    }
  
    sort(){
      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      }else{
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);//include ese campo
      }else{
        this.query = this.query.select('-__v');//exclude ese campo
      }
      return this;
    }
  
    paginate(){
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
  
      return this;
    }
  
}
module.exports = APIFeatures;