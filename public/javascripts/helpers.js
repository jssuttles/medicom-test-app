window.helpers = {
  /**
   * Get data from the given url
   * @param {String} url          url to get data
   * @param {Object} [data]       data to use to get data, will be converted to queryString
   * @param {Object} [options]    options to pass to $.ajax
   * @return {Promise<*>}         data returned from server
   */
  get: (url, data, options) => new Promise((resolve, reject) => {
    $.ajax({
      type: 'get',
      url,
      data: data ? JSON.stringify(data) : null,
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
      ...options,
    });
  }),
  /**
   * Post data to the given url
   * @param {String} url        url to post data to
   * @param {Object} [data]     data to post, will be added to body
   * @param {Object} [options]  options to pass to $.ajax
   * @return {Promise<*>}       data returned from server
   */
  post: (url, data, options) => new Promise((resolve, reject) => {
    $.ajax({
      type: 'post',
      url,
      data: data ? JSON.stringify(data) : null,
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
      ...options,
    });
  }),
  /**
   * Given a template id, return a new jQuery object from that template
   * @param {String} templateId       id of the template to retrieve
   * @return {JQuery<HTMLElement>}
   */
  getHTMLFromTemplate: (templateId) => $(document.querySelector(`#${templateId}`).innerHTML),
};
