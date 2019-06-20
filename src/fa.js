/* eslint-disable import/no-extraneous-dependencies */
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';

library.add(faSpinner, faBars, faEnvelope, faFacebook, faFilter, faGlobe, faPhone, faTimes, faTwitter);

export default library;
