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
    const { data, fails } = response.data;
    let message = null;

    if (fails.length === 0) {
      cache[category] = {
        data,
        expires: (new Date()).getTime() + 1000 * 60 * 5,
      };
    } else {
      message = `${fails.join(', ')} systems could not be reached. Please try again later.`;
    }

    return [data, message];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  return null;
};

const getCategory = async (category) => {
  let data;

  data = getFromCache(category);
  if (data === null) {
    data = await getFromServer(category);
  }

  return data;
};

export default { getCategory };
