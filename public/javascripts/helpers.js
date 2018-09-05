window.helpers = {
  get: (url, data, options) => new Promise((resolve, reject) => {
    const allOptions = Object.assign({
      type: 'get',
      url,
      data,
      headers: {
        Accept: 'application/json',
      },
      dataType: 'json',
      contentType: 'application/json',
      success: (result) => {
        resolve(result);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        reject(errorThrown);
      },
    }, options);
    $.ajax(allOptions);
  }),
  post: (url, data, options) => new Promise((resolve, reject) => {
    const allOptions = Object.assign({
      type: 'post',
      url,
      data,
      headers: {
        Accept: 'application/json',
      },
      dataType: 'json',
      contentType: 'application/json',
      success: (result) => {
        resolve(result);
      },
      error: (jqXHR, textStatus, errorThrown) => {
        reject(errorThrown);
      },
    }, options);
    $.ajax(allOptions);
  }),
  getHTMLFromTemplate: templateId => $(document.querySelector(`#${templateId}`).innerHTML),
};
