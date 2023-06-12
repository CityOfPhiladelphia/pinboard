export default {
  dataSources: {
    holidays: {
      id: 'holidays',
      type: 'http-get',
      dependent: 'none',
      resettable: false,
      url: 'https://api.phila.gov/phila/trashday/v1',
      options: {
      //   params: {
      //     where: '1=1',
      //     outFields: '*',
      //     f: 'pjson',
      //     outSR: 4326,
      //     // outSR: 3857,
      //   },
      },
    }
  }
};
