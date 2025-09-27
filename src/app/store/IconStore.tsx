import {
  BoxIcon,
  BriefcaseIcon,
  Building1Icon,
  Building2Icon,
  Building3Icon,
  BulbIcon,
  Calendar1Icon,
  Calendar2Icon,
  Calendar3Icon,
  Calendar4Icon,
  CallIcon,
  Chart1Icon,
  Chart2Icon,
  Clock1Icon,
  Clock2Icon,
  CrownIcon,
  EqualizerIcon,
  HandIcon,
  InOutIcon,
  LightningIcon,
  MailIcon,
  Product1Icon,
  Product2Icon,
  Rocket1Icon,
  Rocket2Icon,
  Rocket3Icon,
  Settings1Icon,
  Settings2Icon,
  Settings3Icon,
  Settings4Icon,
  Shapes1Icon,
  Shapes2Icon,
  Shapes3Icon,
  Shapes4Icon,
  SiteFormIcon,
  SoundIcon,
  Star1Icon,
  Star2Icon,
  Star3Icon,
  Target1Icon,
  Target2Icon,
  Tick1Icon,
  Tick2Icon,
  Tie1Icon,
  Tie2Icon,
  User1Icon,
  User2Icon,
  User3Icon,
  User4Icon,
  type Icon,
} from '@/shared';
import { EntityCategory } from '@/shared/lib/models/EntityType/EntityCategory';
import { IconName } from '@/shared/lib/models/Icon/IconName';

interface IconWithColor {
  icon: Icon;
  color: string;
}
class IconStore {
  icons: Icon[] = [
    {
      name: IconName.ROCKET_1,
      icon: <Rocket1Icon />,
    },
    {
      name: IconName.ROCKET_2,
      icon: <Rocket2Icon />,
    },
    {
      name: IconName.ROCKET_3,
      icon: <Rocket3Icon />,
    },
    {
      name: IconName.CROWN,
      icon: <CrownIcon />,
    },
    {
      name: IconName.LIGHTNING,
      icon: <LightningIcon />,
    },
    {
      name: IconName.TICK_1,
      icon: <Tick1Icon />,
    },
    {
      name: IconName.TICK_2,
      icon: <Tick2Icon />,
    },
    {
      name: IconName.BULB,
      icon: <BulbIcon />,
    },
    {
      name: IconName.TARGET_1,
      icon: <Target1Icon />,
    },
    {
      name: IconName.TARGET_2,
      icon: <Target2Icon />,
    },
    {
      name: IconName.STAR_1,
      icon: <Star1Icon />,
    },
    {
      name: IconName.STAR_2,
      icon: <Star2Icon />,
    },
    {
      name: IconName.STAR_3,
      icon: <Star3Icon />,
    },
    {
      name: IconName.CHART_1,
      icon: <Chart1Icon />,
    },
    {
      name: IconName.CHART_2,
      icon: <Chart2Icon />,
    },
    {
      name: IconName.CLOCK_1,
      icon: <Clock1Icon />,
    },
    {
      name: IconName.CLOCK_2,
      icon: <Clock2Icon />,
    },
    {
      name: IconName.SHAPES_1,
      icon: <Shapes1Icon />,
    },
    {
      name: IconName.SHAPES_2,
      icon: <Shapes2Icon />,
    },
    {
      name: IconName.SHAPES_3,
      icon: <Shapes3Icon />,
    },
    {
      name: IconName.SHAPES_4,
      icon: <Shapes4Icon />,
    },
    {
      name: IconName.USER_1,
      icon: <User1Icon />,
    },
    {
      name: IconName.USER_2,
      icon: <User2Icon />,
    },
    {
      name: IconName.USER_3,
      icon: <User3Icon />,
    },
    {
      name: IconName.USER_4,
      icon: <User4Icon />,
    },
    {
      name: IconName.HAND,
      icon: <HandIcon />,
    },
    {
      name: IconName.BUILDING_1,
      icon: <Building1Icon />,
    },
    {
      name: IconName.BUILDING_2,
      icon: <Building2Icon />,
    },
    {
      name: IconName.BUILDING_3,
      icon: <Building3Icon />,
    },
    {
      name: IconName.TIE_1,
      icon: <Tie1Icon />,
    },
    {
      name: IconName.TIE_2,
      icon: <Tie2Icon />,
    },
    {
      name: IconName.IN_OUT,
      icon: <InOutIcon />,
    },
    {
      name: IconName.PRODUCT_1,
      icon: <Product1Icon />,
    },
    {
      name: IconName.PRODUCT_2,
      icon: <Product2Icon />,
    },
    {
      name: IconName.BOX,
      icon: <BoxIcon />,
    },
    {
      name: IconName.BRIEFCASE,
      icon: <BriefcaseIcon />,
    },
    {
      name: IconName.CALENDAR_1,
      icon: <Calendar1Icon />,
    },
    {
      name: IconName.CALENDAR_2,
      icon: <Calendar2Icon />,
    },
    {
      name: IconName.CALENDAR_3,
      icon: <Calendar3Icon />,
    },
    {
      name: IconName.CALENDAR_4,
      icon: <Calendar4Icon />,
    },
    {
      name: IconName.EQUALIZER,
      icon: <EqualizerIcon />,
    },
    {
      name: IconName.SOUND,
      icon: <SoundIcon />,
    },
    {
      name: IconName.MAIL,
      icon: <MailIcon />,
    },
    {
      name: IconName.SETTINGS_1,
      icon: <Settings1Icon />,
    },
    {
      name: IconName.SETTINGS_2,
      icon: <Settings2Icon />,
    },
    {
      name: IconName.SETTINGS_3,
      icon: <Settings3Icon />,
    },
    {
      name: IconName.SETTINGS_4,
      icon: <Settings4Icon />,
    },
    {
      name: IconName.CALL,
      icon: <CallIcon />,
    },
    {
      name: IconName.SITE_FORM,
      icon: <SiteFormIcon />,
    },
  ];

  defaultEntityIconWithColor: Map<EntityCategory, IconWithColor> = new Map([
    [
      EntityCategory.COMPANY,
      {
        icon: {
          name: IconName.BUILDING_2,
          icon: <Building2Icon />,
        },
        color: 'var(--primary-statuses-orange-440)',
      },
    ],
    [
      EntityCategory.CONTACT,
      {
        icon: {
          name: IconName.USER_2,
          icon: <User2Icon />,
        },
        color: 'var(--primary-statuses-noun-440)',
      },
    ],
    [
      EntityCategory.CONTRACTOR,
      {
        icon: {
          name: IconName.TIE_2,
          icon: <Tie2Icon />,
        },
        color: 'var(--primary-statuses-amethyst-360)',
      },
    ],
    [
      EntityCategory.DEAL,
      {
        icon: {
          name: IconName.CROWN,
          icon: <CrownIcon />,
        },
        color: 'var(--primary-statuses-pink-360)',
      },
    ],
    [
      EntityCategory.HR,
      {
        icon: {
          name: IconName.STAR_2,
          icon: <Star2Icon />,
        },
        color: 'var(--primary-statuses-purple-360)',
      },
    ],
    [
      EntityCategory.PARTNER,
      {
        icon: {
          name: IconName.SHAPES_3,
          icon: <Shapes3Icon />,
        },
        color: 'var(--primary-statuses-amethyst-360)',
      },
    ],
    [
      EntityCategory.PROJECT,
      {
        icon: {
          name: IconName.BULB,
          icon: <BulbIcon />,
        },
        color: 'var(--primary-statuses-blue-360)',
      },
    ],
    [
      EntityCategory.SUPPLIER,
      {
        icon: {
          name: IconName.PRODUCT_1,
          icon: <Product1Icon />,
        },
        color: 'var(--primary-statuses-amethyst-360)',
      },
    ],
    [
      EntityCategory.UNIVERSAL,
      {
        icon: {
          name: IconName.STAR_1,
          icon: <Star1Icon />,
        },
        color: 'var(--primary-statuses-malachite-480)',
      },
    ],
  ]);

  get firstIcon(): Icon {
    const firstIcon = this.icons[0];

    if (!firstIcon) throw new Error('IconStore has no icons, failed to get the first icon');

    return firstIcon;
  }

  getByName = (name: IconName): Icon => {
    const icon = this.icons.find(i => i.name === name);

    if (!icon) {
      console.error(`Icon with name ${name} was not found`);

      return this.firstIcon;
    }

    return icon;
  };

  get defaultModuleColor(): string {
    return 'var(--primary-statuses-crimson-360)';
  }

  get defaultSchedulerIcon(): Icon {
    const icon = this.icons.find(i => i.name === IconName.CALENDAR_4);

    return icon ?? this.firstIcon;
  }

  get defaultProductsIcon(): Icon {
    const icon = this.icons.find(i => i.name === IconName.BOX);

    return icon ?? this.firstIcon;
  }

  get schedulerColor(): string {
    return 'var(--primary-statuses-crimson-360)';
  }

  get productsColor(): string {
    return 'var(--primary-statuses-salad-480)';
  }

  get systemModuleColor(): string {
    return 'var(--primary-statuses-green-520)';
  }

  getDefaultIconByEntityCategory = (entityCategory: EntityCategory): Icon => {
    const icon = this.defaultEntityIconWithColor.get(entityCategory)?.icon;

    return icon ?? this.firstIcon;
  };

  getEntityColorByEntityCategory = (entityCategory: EntityCategory): string => {
    return this.defaultEntityIconWithColor.get(entityCategory)?.color ?? this.defaultModuleColor;
  };
}

export const iconStore = new IconStore();
