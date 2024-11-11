
import App from './App';
import './index.css'; // Ensure this line is present
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { Toaster } from './components/ui/toaster';

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Provider store={store}>
    <App />
    <Toaster />
</Provider>

</BrowserRouter>


)
