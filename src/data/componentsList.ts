export interface DesignSystemComponent {
  name: string
  href: string
  description: string
  installed: boolean
  category: 'Inputs' | 'Data Display' | 'Feedback' | 'Navigation' | 'Overlay' | 'Layout' | 'Utility'
}

export const componentsList: DesignSystemComponent[] = [
  {
    name: 'Accordion',
    href: 'https://ui.shadcn.com/docs/components/accordion',
    description: 'A vertically stacked set of interactive headings that each reveal a section of content.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Alert',
    href: 'https://ui.shadcn.com/docs/components/alert',
    description: 'Displays a callout for user attention.',
    installed: true,
    category: 'Feedback'
  },
  {
    name: 'Alert Dialog',
    href: 'https://ui.shadcn.com/docs/components/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Aspect Ratio',
    href: 'https://ui.shadcn.com/docs/components/aspect-ratio',
    description: 'Displays content within a desired ratio.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Auto Form',
    href: 'https://www.shadcn-vue.com/docs/components/auto-form',
    description: 'A component that builds forms from a Zod schema automatically.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Avatar',
    href: 'https://ui.shadcn.com/docs/components/avatar',
    description: 'An image element with a fallback for representing the user.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Badge',
    href: 'https://ui.shadcn.com/docs/components/badge',
    description: 'Displays a badge or a component that looks like a badge.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Breadcrumb',
    href: 'https://ui.shadcn.com/docs/components/breadcrumb',
    description: 'Displays the path to the current resource using a hierarchy of links.',
    installed: true,
    category: 'Navigation'
  },
  {
    name: 'Button',
    href: 'https://ui.shadcn.com/docs/components/button',
    description: 'Displays a button or a component that looks like a button.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Button Group',
    href: 'https://ui.shadcn.com/docs/components/button-group',
    description: 'A container that groups related buttons together with consistent styling.',
    installed: false,
    category: 'Inputs'
  },
  {
    name: 'Calendar',
    href: 'https://ui.shadcn.com/docs/components/calendar',
    description: 'A calendar component that allows users to select a date or a range of dates.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Card',
    href: 'https://ui.shadcn.com/docs/components/card',
    description: 'Displays a card with header, content, and footer.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Carousel',
    href: 'https://ui.shadcn.com/docs/components/carousel',
    description: 'A carousel with motion and swipe built using Embla.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Chart',
    href: 'https://ui.shadcn.com/docs/components/chart',
    description: 'Beautiful charts. Built using Recharts. Copy and paste into your apps.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Checkbox',
    href: 'https://ui.shadcn.com/docs/components/checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Collapsible',
    href: 'https://ui.shadcn.com/docs/components/collapsible',
    description: 'An interactive component which expands/collapses a panel.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Combobox',
    href: 'https://ui.shadcn.com/docs/components/combobox',
    description: 'Autocomplete input with a list of suggestions.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Command',
    href: 'https://ui.shadcn.com/docs/components/command',
    description: 'Command menu for search and quick actions.',
    installed: true,
    category: 'Navigation'
  },
  {
    name: 'Context Menu',
    href: 'https://ui.shadcn.com/docs/components/context-menu',
    description: 'Displays a menu of actions triggered by a right click.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Data Table',
    href: 'https://ui.shadcn.com/docs/components/data-table',
    description: 'Powerful table and datagrids built using TanStack Table.',
    installed: false,
    category: 'Data Display'
  },
  {
    name: 'Date Picker',
    href: 'https://ui.shadcn.com/docs/components/date-picker',
    description: 'A date picker component with range and presets.',
    installed: false,
    category: 'Inputs'
  },
  {
    name: 'Dialog',
    href: 'https://ui.shadcn.com/docs/components/dialog',
    description: 'A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Direction',
    href: 'https://ui.shadcn.com/docs/components/direction',
    description: 'A provider component that sets the text direction for your application.',
    installed: false,
    category: 'Utility'
  },
  {
    name: 'Drawer',
    href: 'https://ui.shadcn.com/docs/components/drawer',
    description: 'A drawer component for React.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Dropdown Menu',
    href: 'https://ui.shadcn.com/docs/components/dropdown-menu',
    description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Empty',
    href: 'https://ui.shadcn.com/docs/components/empty',
    description: 'Use the Empty component to display an empty state.',
    installed: false,
    category: 'Data Display'
  },
  {
    name: 'Field',
    href: 'https://ui.shadcn.com/docs/components/field',
    description: 'Combine labels, controls, and help text to compose accessible form fields and grouped inputs.',
    installed: false,
    category: 'Inputs'
  },
  {
    name: 'Form',
    href: 'https://www.shadcn-vue.com/docs/components/form',
    description: 'A component for building accessible form validations with Vee-Validate.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Hover Card',
    href: 'https://ui.shadcn.com/docs/components/hover-card',
    description: 'For sighted users to preview content available behind a link.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Input',
    href: 'https://ui.shadcn.com/docs/components/input',
    description: 'A text input component for forms and user data entry with built-in styling and accessibility features.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Input Group',
    href: 'https://ui.shadcn.com/docs/components/input-group',
    description: 'Add addons, buttons, and helper content to inputs.',
    installed: false,
    category: 'Inputs'
  },
  {
    name: 'Input OTP',
    href: 'https://ui.shadcn.com/docs/components/input-otp',
    description: 'Accessible one-time password component with copy-paste functionality.',
    installed: false,
    category: 'Inputs'
  },
  {
    name: 'Item',
    href: 'https://ui.shadcn.com/docs/components/item',
    description: 'A versatile component for displaying content with media, title, description, and actions.',
    installed: false,
    category: 'Data Display'
  },
  {
    name: 'Kbd',
    href: 'https://ui.shadcn.com/docs/components/kbd',
    description: 'Used to display textual user input from keyboard.',
    installed: false,
    category: 'Data Display'
  },
  {
    name: 'Label',
    href: 'https://ui.shadcn.com/docs/components/label',
    description: 'Renders an accessible label associated with controls.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Menubar',
    href: 'https://ui.shadcn.com/docs/components/menubar',
    description: 'A visually persistent menu common in desktop applications that provides quick access to a consistent set of commands.',
    installed: true,
    category: 'Navigation'
  },
  {
    name: 'Native Select',
    href: 'https://ui.shadcn.com/docs/components/native-select',
    description: 'A styled native HTML select element with consistent design system integration.',
    installed: false,
    category: 'Inputs'
  },
  {
    name: 'Navigation Menu',
    href: 'https://ui.shadcn.com/docs/components/navigation-menu',
    description: 'A collection of links for navigating websites.',
    installed: true,
    category: 'Navigation'
  },
  {
    name: 'Pagination',
    href: 'https://ui.shadcn.com/docs/components/pagination',
    description: 'Pagination with page navigation, next and previous links.',
    installed: true,
    category: 'Navigation'
  },
  {
    name: 'Popover',
    href: 'https://ui.shadcn.com/docs/components/popover',
    description: 'Displays rich content in a portal, triggered by a button.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Progress',
    href: 'https://ui.shadcn.com/docs/components/progress',
    description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    installed: true,
    category: 'Feedback'
  },
  {
    name: 'Radio Group',
    href: 'https://ui.shadcn.com/docs/components/radio-group',
    description: 'A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Resizable',
    href: 'https://ui.shadcn.com/docs/components/resizable',
    description: 'Accessible resizable panel groups and layouts with keyboard support.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Scroll Area',
    href: 'https://ui.shadcn.com/docs/components/scroll-area',
    description: 'Augments native scroll functionality for custom, cross-browser styling.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Select',
    href: 'https://ui.shadcn.com/docs/components/select',
    description: 'Displays a list of options for the user to pick from—triggered by a button.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Separator',
    href: 'https://ui.shadcn.com/docs/components/separator',
    description: 'Visually or semantically separates content.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Sheet',
    href: 'https://ui.shadcn.com/docs/components/sheet',
    description: 'Extends the Dialog component to display content that complements the main content of the screen.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Sidebar',
    href: 'https://ui.shadcn.com/docs/components/sidebar',
    description: 'A composable, themeable and customizable sidebar component.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Skeleton',
    href: 'https://ui.shadcn.com/docs/components/skeleton',
    description: 'Use to show a placeholder while content is loading.',
    installed: true,
    category: 'Feedback'
  },
  {
    name: 'Slider',
    href: 'https://ui.shadcn.com/docs/components/slider',
    description: 'An input where the user selects a value from within a given range.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Sonner',
    href: 'https://ui.shadcn.com/docs/components/sonner',
    description: 'An opinionated toast component.',
    installed: true,
    category: 'Feedback'
  },
  {
    name: 'Spinner',
    href: 'https://ui.shadcn.com/docs/components/spinner',
    description: 'An indicator that can be used to show a loading state.',
    installed: false,
    category: 'Feedback'
  },
  {
    name: 'Switch',
    href: 'https://ui.shadcn.com/docs/components/switch',
    description: 'A control that allows the user to toggle between checked and not checked.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Table',
    href: 'https://ui.shadcn.com/docs/components/table',
    description: 'A responsive table component.',
    installed: true,
    category: 'Data Display'
  },
  {
    name: 'Tabs',
    href: 'https://ui.shadcn.com/docs/components/tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    installed: true,
    category: 'Layout'
  },
  {
    name: 'Textarea',
    href: 'https://ui.shadcn.com/docs/components/textarea',
    description: 'Displays a form textarea or a component that looks like a textarea.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Toast',
    href: 'https://ui.shadcn.com/docs/components/toast',
    description: 'A succinct message that is displayed temporarily.',
    installed: false,
    category: 'Feedback'
  },
  {
    name: 'Toggle',
    href: 'https://ui.shadcn.com/docs/components/toggle',
    description: 'A two-state button that can be either on or off.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Toggle Group',
    href: 'https://ui.shadcn.com/docs/components/toggle-group',
    description: 'A set of two-state buttons that can be toggled on or off.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Tooltip',
    href: 'https://ui.shadcn.com/docs/components/tooltip',
    description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    installed: true,
    category: 'Overlay'
  },
  {
    name: 'Number Field',
    href: 'https://www.shadcn-vue.com/docs/components/number-field',
    description: 'A numeric input with increment and decrement buttons.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Pin Input',
    href: 'https://www.shadcn-vue.com/docs/components/pin-input',
    description: 'A field for entering multi-digit PIN codes.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Stepper',
    href: 'https://www.shadcn-vue.com/docs/components/stepper',
    description: 'A guide to track and display progress through a multi-step sequence.',
    installed: true,
    category: 'Navigation'
  },
  {
    name: 'Tags Input',
    href: 'https://www.shadcn-vue.com/docs/components/tags-input',
    description: 'An input for adding, managing and deleting a set of keywords or tags.',
    installed: true,
    category: 'Inputs'
  },
  {
    name: 'Typography',
    href: 'https://ui.shadcn.com/docs/components/typography',
    description: 'Styles for headings, paragraphs, lists, etc.',
    installed: false,
    category: 'Utility'
  }
]
