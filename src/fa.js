/* eslint-disable import/no-extraneous-dependencies */
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import { faSquare } from '@fortawesome/free-regular-svg-icons/faSquare';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons/faSlidersH';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons/faAngleDown';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons/faAngleUp';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faMinus } from '@fortawesome/free-solid-svg-icons/faMinus';

// console.log('pinboard fa.js, faSearch:', faSearch, 'faAngleDown:', faAngleDown);

library.add(
  faSpinner,
  faBars,
  faEnvelope,
  faFacebook,
  faFilter,
  faGlobe,
  faPhone,
  faUser,
  faTimes,
  faTwitter,
  faInstagram,
  faCheckSquare,
  faSquare,
  faInfoCircle,
  faExclamation,
  faSearch,
  faSlidersH,
  faAngleDown,
  faAngleUp,
  faPlus,
  faMinus,
);

// console.log('pinboard fa.js, library:', library);

export default library;
