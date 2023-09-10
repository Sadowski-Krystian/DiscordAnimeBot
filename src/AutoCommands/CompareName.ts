export const compare = ( a: any, b: any ) => {
    if ( a.username < b.username ){
      return -1;
    }
    if ( a.username > b.username ){
      return 1;
    }
    return 0;
  }