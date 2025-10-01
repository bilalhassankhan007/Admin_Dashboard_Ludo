const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'home',
          url: '/dashboard'
        }
      ]
    },
    {
      id: 'ui-element',
      title: '',
      subtitle: 'UI Components',
      type: 'group',
      icon: 'icon-ui',
      children: [
        {
          id: 'leaderboard',
          title: 'Leaderboard',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'leaderboard',
          url: '/leaderboard'
        },
        {
          id: 'players',
          title: 'Players',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'people',
          url: '/players'
        }
      ]
    },
    {
      id: 'pages',
      title: 'Accounts',
      subtitle: 'Login & Register here',
      type: 'group',
      icon: 'icon-pages',
      children: [
        {
          id: 'login',
          title: 'Login',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'verified_user',
          url: '/auth/login',
          target: true
        },
        {
          id: 'register',
          title: 'Register',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'person_add_alt_1',
          url: '/auth/register',
          target: true
        }
      ]
    },
    {
      id: 'support',
      title: 'Transactions Details',
      subtitle: 'Track & Check-out Our Transactions Details',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'transaction-history',
          title: 'Transaction History',
          type: 'item',
          url: '/transaction-history',
          classes: 'nav-item',
          icon: 'material-icons-two-tone',
          iconname: 'history'
        }
        // {
        //   id: 'withdrawal',
        //   title: 'Withdrawal Request',
        //   type: 'item',
        //   url: '/withdrawal',
        //   classes: 'nav-item',
        //   icon: 'material-icons-two-tone',
        //   iconname: 'payment'
        // }
      ]
    },
    {
      // id: 'user-details',
      // title: 'User Profile',
      // subtitle: 'View & Manage Player Info',
      // type: 'group',
      // icon: 'icon-user',
      children: [
        // {
        //   id: 'user-profile',
        //   title: 'User Profile',
        //   type: 'item',
        //   icon: 'material-icons-two-tone',
        //   iconname: 'account_circle',
        //   url: '/user-profile'
        // }
        // {
        //   id: 'wallet-balance',
        //   title: 'Company Wallet',
        //   type: 'item',
        //   icon: 'material-icons-two-tone',
        //   iconname: 'account_balance_wallet',
        //   url: '/wallet-balance'
        // }
        // {
        //   id: 'withdrawal-history',
        //   title: 'Withdrawal History',
        //   type: 'item',
        //   icon: 'material-icons-two-tone',
        //   iconname: 'history',
        //   url: '/withdrawal-history'
        // }
        // {
        //   id: 'game-history',
        //   title: 'Game History',
        //   type: 'item',
        //   icon: 'material-icons-two-tone',
        //   iconname: 'sports_esports',
        //   url: '/game-history'
        // }
      ]
    }
  ]
};

export default menuItems;
