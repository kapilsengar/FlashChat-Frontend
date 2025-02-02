import React, { useState,useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const [Verified,setVerified]=useState(0)
  const [step,setStep]=useState(0)
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [timer, setTimer] = useState(0); // Timer state
  const [image, setImage] = useState('');

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.{6,})/; // At least 6 characters and includes a number
    return regex.test(password);
  };

  const handleEmailValidation = () => {
    if (!email) {
      setErrorMessage("Email cannot be empty");
    } else if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address");
    } else {
      setErrorMessage("");
      // Navigate to a different screen
     setStep(1)
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://192.168.187.10:8000/send-otp", {
        name,
        email,
        password,
      });
      if (response.data) {
        setOtpSent(true);
        console.log("OTP Sent State:", otpSent);
        setMessage(response.data.message || "OTP sent to your email");
        console.log("message",message)
        console.log("messageotp",otpSent)
        
        // Alert.alert("OTP Sent", response.data.message || "Check your email");
      } else {
        Alert.alert("Error", response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP");
    }
  };
  const userotp=otp
  const verifyOtp = async () => {
    try {
      
      console.log("userotp",otp)
      const response = await axios.post("http://192.168.187.10:8000/verify-otp", {
        email,
        userotp,

      });
      console.log("data",response.data)
      if (response.data) {
        Alert.alert("Verification  Successful", "Go for  registration");
        
        setOtpSent(false);
        console.log("sjhsdhsjdhsdjsdsjdsd",otpSent)
        setVerified(1)
        // navigation.goBack(); // Navigate back to login or desired screen
      } else {
        Alert.alert("Error", response.data.message || "Invalid OTP");
        console.log("Error", response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Failed to verify OTP");
    }
  };

  const handleRegister = async () => {
    try {
        console.log("Registering with data:", { name, email, password, userotp });

        const response = await axios.post("http://192.168.187.10:8000/register", {
            name,
            email,
            password,
            userotp,
            image
        });

        console.log("Response from backend:", response.data);

        if (response.data) {
            Alert.alert("Success", "Registration completed successfully!");
            setStep(0);
            setName("");
            setEmail("");
            setPassword("");
            setImage("");
            // setConfirmPassword("");
            setOtp("");
            setOtpSent(false);
            setVerified(false);
            navigation.navigate('Login')
        } else {
            Alert.alert("Error", response.data.message || "Failed to register user");
        }
    } catch (error) {
        // Log error response from Axios
        console.error("Registration Error:", error.response ? error.response.data : error.message);
        Alert.alert("Error", error.response?.data?.message || "Failed to register. Please try again.");
    }
};

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      
      {step==0 && (
        <View>
           <View style={{alignItems:'center'}}>
        <Image
          style={{ width: 150, height: 100, marginTop: 90 ,resizeMode:'contain' }}
          source={{
            uri: "https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png",
          }}
        />
      </View>

      <View style={{alignItems:'center'}}>
        <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 12 }}>
          {otpSent ? "Verify OTP" : "Set up your Profile"}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 12,color:'grey' }}>
          {otpSent ? "." : "Profiles are visible to your friends  and \n              connections and groups"}
        </Text>
        <Pressable style={{marginTop: 20}}>
              <Image
                source={{
                  uri: image
                    ? image
                    : 'https://cdn-icons-png.flaticon.com/128/149/149071.png',
                }}
                style={{width: 50, height: 50, borderRadius: 25}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 4,
                  color: 'gray',
                  fontSize: 12,
                }}>
                Add
              </Text>
            </Pressable>
      </View>

      <View style={{ marginTop: 30 }}>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
            placeholder="Enter your Name"
          />
        </View>

      <View style={{ marginTop: 17 }}>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage(""); // Clear error message while typing
              }}
              style={styles.input}
              placeholder="Enter your E-mail"
            />
            {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
          </View>
          <View>
                <TextInput
                  value={image}
                  onChangeText={setImage}
                 
                  style={styles.input}
                  placeholder="Enter your image url"
                />
              </View>

          <View style={{ marginTop: 20 }}>
        <Pressable
          onPress={()=>{
            handleEmailValidation()
            
          }
            }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
        </View>
        <Pressable
                  onPress={() => navigation.navigate('Login')}
                  style={{ marginTop: 15 }}
                >
                  <Text style={{ fontSize: 15, color: 'grey', textAlign: 'center' }}>
                    Already have an Account? Log In
                  </Text>
                </Pressable>
        </View>
      )}


{step === 1 && (
  <View>
    <View style={{ alignItems: "center" }}>
      <Image
        style={{ width: 150, height: 100, marginTop: 90,resizeMode:'contain' }}
        source={{
          uri: "https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png",
        }}
      />
    </View>

    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 19 }}>
        {otpSent ? "Verify OTP" : "Register to your Account"}
      </Text>
    </View>

    {/* Conditional Rendering Based on Verification */}
    {Verified === 0 ? (
      <View>
        {/* Email Input */}
        {!otpSent && (
          <View style={{ marginTop: 70 }}>
            <TextInput
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage(""); // Clear error message while typing
              }}
              style={styles.input}
              placeholder="Enter your E-mail"
            />
          </View>
        )}

        {/* OTP Input */}
        {otpSent && (
          <View style={{ marginTop: 90, }}>
            <TextInput
              value={otp}
              onChangeText={(text) => setOtp(text)}
              style={{
                backgroundColor: "#8395A7",
                padding: 8,
                color: "black",
                marginVertical: 10,
                width: 180,
                borderRadius: 6,
                fontSize: 18,
                alignSelf:'center'
              }}
              placeholder="Enter OTP"
            />
            <View>
            <Pressable
              onPress={() => {
                verifyOtp();
                setVerified(1);
                setStep(2)
              }}
              style={{
                backgroundColor: "#F3B431",
                padding: 6,
                color: "black",
                marginVertical: 10,
                width: 100,
                borderRadius: 6,
                fontSize: 18,
                marginLeft: 20,
                alignSelf:'center',
                marginTop:20
              }}
            >
              <Text style={styles.buttonText}>Verify OTP</Text>
            </Pressable>
            </View>
          </View>
        )}

        {/* Send OTP Button */}
        {!otpSent && (
          <View style={{ marginTop: 20 }}>
          <Pressable onPress={()=>{
            handleSendOtp()
            setTimer(30);
          }
          } style={styles.button}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </Pressable>
          {timer > 0 && (
            <Text style={{ textAlign: "center", marginTop: 10, color: "gray" }}>
              Resend OTP in {timer} seconds
            </Text>
          )}
        </View>
        )}

        {/* Error Message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
      </View>
    ) : (
      <View style={{ alignItems: "center", marginTop: 70 }}>
        {/* Verified Message */}
        <Text style={{ color: "green", fontSize: 18, fontWeight: "bold" }}>
          Verified Successfully
        </Text>
      </View>
    )}

    {/* Next Button */}
    {Verified === 1 && (
      <View style={{ marginTop: 60 }}>
        <Pressable
          onPress={() => {
            setStep(2);
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    )}
  </View>
)}

{step==2 && (
  <View>
     <View style={{ alignItems: "center" }}>
      <Image
        style={{ width: 150, height: 100, marginTop: 90,resizeMode:'contain' }}
        source={{
          uri: "https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png",
        }}
      />
    </View>

    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 19 }}>
        {otpSent ? "Verify OTP" : "Register to your Account"}
      </Text>
    </View>
    <View style={{ marginTop: 20,alignSelf:'center' }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
            placeholder="Create your Password"
          />
          
        </View>
        {passwordError ? (
          <Text style={{textAlign:'center'}} numberOfLines={2} >{passwordError}</Text>
        ) : null}
        
        
    <View style={{ marginTop: 20,alignSelf:'center' }}>
          <TextInput
            // value={password}
            // onChangeText={setPassword}
            secureTextEntry={true}
            style={styles.input}
            placeholder="Re-Enter your Password"
          />
        </View>
        {Verified === 1 && (
      <View style={{ marginTop: 60 }}>
        <Pressable
          onPress={() => {
            if (validatePassword(password)) {
              setStep(3);
            } else {
              setPasswordError("Password must be at least 6 characters long and include a number.");
            }
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Next</Text>
        </Pressable>
      </View>
    )}

  </View>
)}


{step==3 && (
  <View>
    <View style={{ alignItems: "center" }}>
      <Image
        style={{ width: 150, height: 100, marginTop: 90,resizeMode:"contain" }}
        source={{
          uri: "https://assets.stickpng.com/thumbs/5f44f3e6acda2c000402a6ee.png",
        }}
      />
    </View>

    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 19,width:270 }}>
        {otpSent ? "Verify OTP" : "We appreciate your patience in providing all the required details. Now, you're just one step away from completing your registration. \n\nClick the button below to register as a \n          new user and get started!"}
      </Text>
    </View>
    <View style={{ marginTop: 80 }}>
        <Pressable
          onPress={()=>{
            handleRegister()
           
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
        <Pressable
                  onPress={() => navigation.navigate('Login')}
                  style={{ marginTop: 15 }}
                >
                  <Text style={{ fontSize: 15, color: 'grey', textAlign: 'center' }}>
                    Already have an Account? Log In
                  </Text>
                </Pressable>
      </View>
  </View>
)}
 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#8395A7",
    padding: 8,
    color: "black",
    marginVertical: 10,
    width: 300,
    borderRadius: 6,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#F3B431",
    width: 200,
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});