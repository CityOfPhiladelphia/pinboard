/* eslint-disable import/no-extraneous-dependencies */
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';

import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';

library.add(faBars, faFilter, faPhone, faEnvelope, faGlobe, faTwitter, faFacebook);

export default library;
