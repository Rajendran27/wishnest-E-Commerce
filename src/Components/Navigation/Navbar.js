import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import './Navbar.css'
import AccountMenu from './AccountMenu';
import NameCard from '../Assets/NameCard.png'
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import BrushIcon from '@mui/icons-material/Brush';
import BlenderIcon from '@mui/icons-material/Blender';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ChairIcon from '@mui/icons-material/Chair';
import ToysIcon from '@mui/icons-material/Toys';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Filter from '../Filter&Category/Filter';
import NameLogo from '../Assets/icon.png'
import { SearchContext } from './SearchContext';
import axios from 'axios';


const drawerWidth = 240;
const closedDrawerWidth = 150; // Increased width when drawer is closed

// ---------- Search Styles ----------
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: theme.spacing(3),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '20ch',
  },
}));

// ---------- Drawer Styles ----------
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: closedDrawerWidth, // Use the increased width
  [theme.breakpoints.up('sm')]: {
    width: closedDrawerWidth, // Use the increased width for all screen sizes
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? drawerWidth : closedDrawerWidth, // Use different widths based on open state
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open
      ? {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        }
      : {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        }),
  })
);

// ---------- Main Component ----------
export default function MiniDrawer() {

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [cartCount, setCartCount] = React.useState(0);
  const { searchTerm, setSearchTerm, suggestions, setSuggestions } = React.useContext(SearchContext);

  // NEW: show labels when DrawerHeader is clicked (only while drawer is closed)
  const [showLabels, setShowLabels] = React.useState(false);

   const role = (localStorage.getItem("role") || "").trim().toLowerCase();
   const username = (localStorage.getItem("name") || "").trim();

   const handleSearchChange = async (e) => {
  const value = e.target.value;
  setSearchTerm(value);

  if (value.trim() === "") {
    setSuggestions([]);
    return;
  }
try {
    const [mob, elec, fashion, beauty, kitchen, Sports, Furniture, Toys] = await Promise.all([
      axios.get("http://localhost:3003/Mobile"),
      axios.get("http://localhost:3004/Electronics"),
      axios.get("http://localhost:3005/Fashion"),
      axios.get("http://localhost:3006/Beauty"),
      axios.get("http://localhost:3007/Kitchen"),
      axios.get("http://localhost:3008/Sports"),
      axios.get("http://localhost:3009/Furniture"),
      axios.get("http://localhost:3010/Toys"),
    ]);

    const all = [...mob.data, ...elec.data, ...fashion.data, ...beauty.data, ...kitchen.data, ...Sports.data, ...Furniture.data, ...Toys.data];
    const filtered = all
      .filter((p) => p.name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 5); // limit to 5 suggestions
    setSuggestions(filtered);
    
    
  } catch (err) {
    console.error("Error fetching suggestions:", err);
  }
};

// When pressing Enter → go to Search page
const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    navigate("/search");
    setSuggestions([]); // hide dropdown
    setSearchTerm("");
  }
};

React.useEffect(() => {
  // Function to load cart count from localStorage
  const loadCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.length;
    setCartCount(totalItems);
  };

  loadCartCount(); // Load on mount

  // Listen for localStorage updates from other components
  window.addEventListener("storage", loadCartCount);

  // Optional: poll localStorage every second (for same-tab updates)
  const interval = setInterval(loadCartCount, 1000);

  return () => {
    window.removeEventListener("storage", loadCartCount);
    clearInterval(interval);
  };
}, []);

  // Menu items

let menuItems = [
  { text: 'Dashboard', icon: <DashboardTwoToneIcon fontSize='large' className="dashboard" />, path: '/' },
  { text: 'Fashion', icon: <CheckroomIcon fontSize='large' className="dashboard" />, path: '/Fashion' },
  { text: 'Electronics & Appliances', icon: <ElectricalServicesIcon fontSize='large' className="dashboard" />, path: '/Electronics-Appliances' },
  { text: 'Mobile', icon: <MobileScreenShareIcon fontSize='large' className="dashboard" />, path: '/mobiles' },
  { text: 'Beauty', icon: <BrushIcon fontSize='large' className="dashboard" />, path: '/Beauty' },
  { text: 'Home & Kitchen', icon: <BlenderIcon fontSize='large' className="dashboard" />, path: '/Home-Kitchen' },
  { text: 'Sports & Games', icon: <SportsEsportsIcon fontSize='large' className="dashboard" />, path: '/Sports-Games' },
  { text: 'Furniture', icon: <ChairIcon fontSize='large' className="dashboard" />, path: '/Furniture' },
  { text: 'Toys', icon: <ToysIcon fontSize='large' className="dashboard" />, path: '/Toys' },
];

// 👇 Add extra menus for user
if (role === "user") {
  menuItems.push(
    // { text: 'Fashion', icon: <CheckroomIcon fontSize='large' className="dashboard" />, path: '/Fashion' },
    // { text: 'Electronics & Appliances', icon: <ElectricalServicesIcon fontSize='large' className="dashboard" />, path: '/Electronics-Appliances' },
    // { text: 'Mobile', icon: <MobileScreenShareIcon fontSize='large' className="dashboard" />, path: '/mobiles' },
    // { text: 'Beauty', icon: <BrushIcon fontSize='large' className="dashboard" />, path: '/Beauty' },
    // { text: 'Home & Kitchen', icon: <BlenderIcon fontSize='large' className="dashboard" />, path: '/Home-Kitchen' },
    // { text: 'Sports & Games', icon: <SportsEsportsIcon fontSize='large' className="dashboard" />, path: '/Sports-Games' },
    // { text: 'Furniture', icon: <ChairIcon fontSize='large' className="dashboard" />, path: '/Furniture' },
    // { text: 'Toys', icon: <ToysIcon fontSize='large' className="dashboard" />, path: '/Toys' },
  );
}

// 👇 Add admin-only item
if (role === "admin") {
  menuItems.push(
    {text: 'Add Products', icon: <AddShoppingCartIcon fontSize='large' className="dashboard" />, path: '/Add-Products' }
  );
}


  const handleDrawerOpen = () => {
    setOpen(true);
    setShowLabels(false); // reset any header-toggled labels
  };
  const handleDrawerClose = () => {
    setOpen(false);
    setShowLabels(false); // hide header-toggled labels when closing
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ background: 'linear-gradient(90deg, #1e293b, #c0b6deff)', color: '#fff' }}>
       <Toolbar>
  {/* Drawer Toggle Button */}
  <IconButton
    color="inherit"
    aria-label="open drawer"
    onClick={handleDrawerOpen}
    edge="start"
    sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
  >
    <MenuIcon />
  </IconButton>

  {/* Title */}
 <Box
  component="img"
  src={NameLogo}
  alt="WishNest Logo"
  sx={{
    height: 40,
    width: 'auto',
    marginLeft: -3,
    cursor: 'pointer',
    // filter: 'drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3))',
    filter: 'brightness(0) invert(1)',
  }}
  onClick={() => navigate('/')} // optional: go to home when clicked
/>


  {/* Search Field */}
  <Search>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    <Box sx={{ position: "relative" }}>
  <StyledInputBase
    placeholder="Search…"
    inputProps={{ 'aria-label': 'search' }}
    value={searchTerm}
    onChange={handleSearchChange}
    onKeyDown={handleKeyDown}
  />

  {/* Dropdown */}
  {suggestions.length > 0 && (
    <Box
      sx={{
        position: "absolute",
        top: "100%",
        left: 0,
        width: "100%",
        background: "#fff",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        borderRadius: "4px",
        zIndex: 1000,
        color: "#000",
        mt: 1,
      }}
    >
      {suggestions.map((item) => (
        <Box className="suggestion-dropdown"
          key={item.id}
          sx={{
            padding: "8px 12px",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#f2f2f2" },
          }}
          onClick={() => {
            setSearchTerm(item.name);
            navigate("/search");
            setSuggestions([]);
            setSearchTerm("");
          }}
        >
           <img
          src={item.image}
          alt={item.name}
          style={{ width: 40, height: 40, borderRadius: 4, objectFit: "contain" }}
        />
          {item.name}
        </Box>
      ))}
    </Box>
  )}
</Box>

  </Search>


  {/* Icons section */}
  {/* Icons section */}
<Box className="navbar-icons" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  {role !== "admin" && (
    <>
      <FavoriteIcon fontSize="large" className="heart" onClick={() => navigate('/Favorite')} />
        <Badge badgeContent={cartCount} color="primary" overlap="circular"  sx={{ "& .MuiBadge-badge": { fontSize: "0.7rem", height: 18, minWidth: 18 } }}>
      <ShoppingCartIcon fontSize="large" className="cart" onClick={() => navigate('/cart')} />
        </Badge>
    </>
  )}
  <NotificationsNoneIcon fontSize="large" className="bell" />

  {/* ✅ Show username and role next to profile icon */}
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mr: 1 , color:'black'}}>
    <Typography variant="body1" sx={{ fontWeight: 600 }}>
      {username || "Guest"}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#e0e0e0', color:'black' }}>
      {localStorage.getItem("role") || "User"}
    </Typography>
  </Box>

  <AccountMenu fontSize="large" className="profile" />
</Box>



</Toolbar>

      </AppBar>

      {/* Floating Action Buttons just below the AppBar */}
<Filter/>


      {/* Drawer */}
      {/* Clicking the DrawerHeader toggles the labels (only when drawer is closed) */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader
          onClick={() => {
            // only toggle header-labels if drawer is closed
            if (!open) setShowLabels((s) => !s);
          }}
          sx={{ justifyContent: open ? 'space-between' : 'center', alignItems: 'center', cursor: !open ? 'pointer' : 'default' }}
        >
          {open && (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      padding: '1rem 1.2rem',
      transition: 'all 0.3s ease',
    }}
  >
    <Box
      component="img"
      src={NameCard}
      alt="WishNest Logo"
      sx={{
        height: 40,
        marginLeft: 1,
        transition: 'all 0.3s ease',
        filter: 'drop-shadow(1px 1px 2px rgba(255, 69, 0, 0.3))',
      }}
    />
    <Typography
      variant="h5"
      sx={{
        fontWeight: 800,
        fontSize: '1.9rem',
        color: '#222',
        paddingLeft: '10px',
        letterSpacing: '1px',
        textShadow: '1px 1px 2px rgba(255, 69, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* make chevron clicks not bubble up to the header click */}
     <IconButton
  onClick={(e) => { e.stopPropagation(); handleDrawerClose(); }}
  className="btn-close"
>
  {theme.direction === 'rtl' ? <CloseIcon /> : <CloseIcon />}
</IconButton>

    </Typography>
  </Box>
)}

        </DrawerHeader>
        <Divider />

        {/* LIST: show text when drawer open OR when header-toggled (showLabels) */}
       <List className='list'>
  {menuItems.map((item, index) => (
    <React.Fragment key={item.text}>
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          sx={{
            minHeight: 48,
            px: 2.5,
            justifyContent: open ? 'initial' : 'center',
          }}
          onClick={() => item.path && navigate(item.path)}

        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open || showLabels ? 2 : 'auto',
              justifyContent: 'center',
            }}
          >
            {item.icon}
          </ListItemIcon>

          {/* Show text only when drawer is open or header toggled */}
          {(open || showLabels) && (
            <ListItemText
              primary={item.text}
                          primaryTypographyProps={{
              fontWeight: 'bold', // 👈 makes text bold
              fontSize: '16px',   // optional
              color: '#000',      // optional
               whiteSpace: 'normal',   // ✅ allow wrapping
    wordBreak: 'break-word', // ✅ wrap at word boundary if needed
    lineHeight: 1.2,         // ✅ tighter line spacing
            }}
      
              sx={{
                transition: 'opacity 200ms, margin 200ms',
                // whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                 WebkitLineClamp: 2,      // 👈 limit to 2 lines
    WebkitBoxOrient: 'vertical',
     whiteSpace: 'normal',    // 👈 allows wrapping
    lineHeight: 1.2,
     display: '-webkit-box',
     
              }}
            />
          )}
        </ListItemButton>
      </ListItem>

      {/* Divider between items */}
      {index !== menuItems.length - 1 && (
        <Divider sx={{ bgcolor: '#ddd', marginY: 0.5 }} />
      )}
    </React.Fragment>
  ))}
</List>


      </Drawer>

      <Box
        component="main"
        sx={{
          // flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: '-64px', // Account for AppBar height
          ml: open ? `${drawerWidth}px` : `${closedDrawerWidth}px`,
          transition: 'margin 0.3s ease',
          minHeight: '-50vh',
        }}
      >
        
      </Box>
    </Box>
  );
}
