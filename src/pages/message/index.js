import Body from "../../components/home/Body";
import Header from "../../components/home/Header";

const MessageHome = () => {
    return (
      <div>
        <div className="container max-w-full mx-auto shadow-lg rounded-lg">
          {/* <!-- headaer --> */}
          <Header />
          {/* <!-- end header --> */}
          {/* <!-- Chatting --> */}
          <Body />
        </div>
      </div>
    );
};
  
export default MessageHome;