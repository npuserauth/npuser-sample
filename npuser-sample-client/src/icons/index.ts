/*
Import font awesome icons
For Vue 3 see
https://github.com/FortAwesome/vue-fontawesome/issues/230
*/
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowLeft,
  faArrowRight,
  faChevronDown,
  faChevronUp,
  faUserClock,
  faBars,
  faUser,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faArrowLeft,
  faArrowRight,
  faChevronDown,
  faChevronUp,
  faUserClock,
  faBars,
  faUser,
  faEnvelope
)
// IN CODE sample usage is:
// fas-icon(class="fa", icon="user")

import FontAwesomeIcon from "./FontAwesomeIcon.vue";

export { FontAwesomeIcon };
