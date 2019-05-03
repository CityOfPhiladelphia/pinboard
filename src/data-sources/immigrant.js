export default {
  id: 'immigrant',
  type: 'http-get',
  dependent: 'none',
  url: 'https://sheets.googleapis.com/v4/spreadsheets/1j0m09ImgJbuzpPgiia-nYuVs8dzEr9tzJAv1uDsj_AU/values/A2:X49',
  options: {
    params: {
      key: 'key',
    },
    success(data) {
      return data;
    },
  },
}
