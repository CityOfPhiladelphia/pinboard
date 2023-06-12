export default {
  dataSources: {
    zipcodes: {
      id: 'zipcodes',
      type: 'http-get',
      dependent: 'none',
      resettable: false,
      url: 'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/Zipcodes_Poly/FeatureServer/0/query',
      options: {
        params: {
          where: '1=1',
          outFields: '*',
          f: 'pjson',
          outSR: 4326,
          // outSR: 3857,
        },
      },
    }
  }
};
