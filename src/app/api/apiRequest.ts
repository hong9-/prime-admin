
export interface data {
  user?: string
}

export const apiRequest = async(
  type: 'get' | 'post',
  url: string,
  data?: any,
)=> {
  let query: string = url;
  if(type === 'get') {
    query += '?'+new URLSearchParams(data).toString();
  }
  const response = await fetch('/api/'+query, {
    method: type,
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: (type === 'post' && data) ? JSON.stringify(data) : undefined,
  }).catch((e)=> {
    console.log(e);
    return {
      status: 500,
      statusText: 'server down',
      text: ()=>{
        return e
      },
    }
  });

  console.log(response);

  if(response.status === 200) {
    const result = await response.text();
    try {
      return JSON.parse(result);
    } catch(e) {
      return {
        code: 0,
        message: result,
      }
    }
  } else {
    console.log(`status ${response.status}: ${response.statusText}`);
    const result = await response.text();

    try {
      return JSON.parse(result);
    } catch(e) {
      return {
        code: 1500,
        message: result,
      }
    }
  }
}