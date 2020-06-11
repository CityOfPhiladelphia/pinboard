import { format, parseISO } from 'date-fns';

export default {
  date: {
    transform: function (value) {
      let valueTransformed;
      // console.log('date transform running, value:', value, 'typeof value:', typeof value);
      if (typeof value === 'string') {
        valueTransformed = format(parseISO(value), 'MM/dd/yyyy');
      } else {
        valueTransformed = format(value, 'MM/dd/yyyy');
      }
      return valueTransformed;
    },
  },
  toLocaleDateString: {
    transform: function(epoch){
      // console.log('toLocaleDateString transform, epoch:', epoch, typeof epoch);
      let value;
      if (typeof epoch !== 'number') {
        value = epoch;
      } else {
        let utcDate = new Date(0);
        utcDate.setUTCMilliseconds(epoch);
        utcDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
        value = utcDate.toLocaleDateString();
      }
      return value;
    },
  },
  titleCase: {
    transform: function(str) {
      let titleCaseFix = {
        Llc: "LLC",
        Iii: "III",
        Lp: "LP",
        Usa: "USA",
        Trs: "TRS",
        "H/w": "H/W",
        Of: "of",
        Fdr: "FDR",
        "S/w": "S/W",
        Mcclellan: "McClellan",
        "S/m": "S/M",
        And: "and",
        Cp: "CP",
        Us: "US",
        Ltd: "LTD",
        Al: 'AL',
        Ak: 'AK',
        Az: 'AZ',
        Ar: 'AR',
        Ca: 'CA',
        Co: 'CO',
        Ct: 'CT',
        De: 'DE',
        Fl: 'FL',
        Ga: 'GA',
        Hi: 'HI',
        Id: 'ID',
        Il: 'IL',
        In: 'IN',
        Ia: 'IA',
        Ks: 'KS',
        Ky: 'KY',
        La: 'LA',
        Me: 'ME',
        Md: 'MD',
        Ma: 'MA',
        Mi: 'MI',
        Mn: 'MN',
        Ms: 'MS',
        Mo: 'MO',
        Mt: 'MT',
        Ne: 'NE',
        Nv: 'NV',
        Nh: 'NH',
        Nj: 'NJ',
        Nm: 'NM',
        Ny: 'NY',
        Nc: 'NC',
        Nd: 'ND',
        Oh: 'OH',
        Ok: 'OK',
        Or: 'OR',
        Pa: 'PA',
        Ri: 'RI',
        Sc: 'SC',
        Sd: 'SD',
        Tn: 'TN',
        Tx: 'TX',
        Ut: 'UT',
        Vt: 'VT',
        Va: 'VA',
        Wa: 'WA',
        Wv: 'WV',
        Wi: 'WI',
        Wy: 'WY',
      };

      let fixit = function(str) {
        for (let oldCase in titleCaseFix) {
          let newCase = titleCaseFix[oldCase];
        }
        return str;
      };

      str = str.toLowerCase().split(' ').map(function(word) {
        let wordFormatted = word.charAt(0).toUpperCase() + word.slice(1);
        wordFormatted = titleCaseFix[wordFormatted] || wordFormatted;
        return wordFormatted;
      });
      return str.join(' ');
    },
  },
};
