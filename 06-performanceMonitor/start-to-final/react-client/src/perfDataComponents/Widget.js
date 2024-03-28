import Cpu from './Cpu';
import Info from './Info';
import Mem from './Mem';

const Widget = ()=> {
    return (
    <>
        <h1>Widget</h1>
        <Cpu/>
        <Info/>
        <Mem/>
    </>
    );
}
export default Widget;