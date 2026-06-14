import IconApartment from "./apartment";
import IconHealing from "./healing";
import IconForkSpoon from "./fork-spoon";
import IconMuseum from "./museum";
import IconNature from "./nature";
import IconLocalAtm from "./local-atm";
import IconTrain from "./train";
import IconNightLife from "./nightlife";
import IconComedyMask from "./comedy-mask";
import IconEmergency from "./e911-emergency";
import IconFamilyRestroom from "./family-restroom";
import IconPets from "./pets";
import IconInterests from "./interests";
import IconShoppingBag from "./shopping-bag";

export const ICON_COMPONENTS = {
    IconHealing,
    IconForkSpoon,
    IconApartment,
    IconMuseum,
    IconNature,
    IconLocalAtm,
    IconTrain,
    IconNightLife,
    IconComedyMask,
    IconEmergency,
    IconFamilyRestroom,
    IconPets,
    IconInterests,
    IconShoppingBag,
} as const;

export type IconName = keyof typeof ICON_COMPONENTS;
