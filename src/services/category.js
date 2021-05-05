import axios from 'axios';

const baseUrl = process.env.NODE_ENV === 'production'
  ? '' : 'http://localhost:3002';

const cache = {};

const getFromCache = (category) => {
  const cached = cache[category];

  if (cached && cached.expires > (new Date()).getTime()) {
    return cached.data;
  }

  return null;
};

const getFromServer = async (category) => {
  const url = `${baseUrl}/category/${category}`;
  try {
    const response = await axios.get(url);
    const { data, fails, error } = response.data;
    let message = null;

    if (error) {
      return [[], error];
    }

    if (fails && fails.length) {
      message = `${fails.join(', ')} systems could not be reached. Please try again later.`;
    } else {
      cache[category] = {
        data,
        expires: (new Date()).getTime() + 1000 * 60 * 5,
      };
    }

    return [data, message];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return [[], 'Somthing went wrong. Please try again later.'];
  }
};

const getCategory = async (category) => {
  let data;
  let message = null;

  data = getFromCache(category);
  if (data === null) {
    [data, message] = await getFromServer(category);
  }

  return [data, message];
};

export default { getCategory };
