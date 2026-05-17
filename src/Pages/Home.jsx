// Home.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Home() {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <LinearGradient
        colors={["#c9e4f6", "#d6f7ef", "#eaf9e2"]}
        style={styles.heroContainer}
      >
        <Text style={styles.heroTitle}>Smart Mess Management</Text>
        <Text style={styles.heroText}>
          Simplify your daily mess operations with a smooth, elegant platform.
        </Text>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Why Choose Smart Mess?</Text>
        <View style={styles.grid}>
          <FeatureCard
            icon="money-bill-wave"
            color="#14b8a6"
            title="Expense Tracking"
            description="Easily track and manage daily expenses with transparency."
          />
          <FeatureCard
            icon="utensils"
            color="#f59e0b"
            title="Meal Count"
            description="Log daily meals with a click and keep everything organized."
          />
          <FeatureCard
            icon="user-shield"
            color="#6366f1"
            title="Secure Roles"
            description="Separate access for manager and members for better security."
          />
        </View>
      </View>

      {/* How It Works Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> How It Works</Text>
        <View style={styles.grid}>
          <InfoCard step="1" title="Create or Join a Mess" />
          <InfoCard step="2" title="Add Meals & Expenses Daily" />
          <InfoCard step="3" title="Get Dashboard Calculations" />
        </View>
      </View>

      {/* Testimonials */}
      <View style={[styles.section, { backgroundColor: "#f9fafb" }]}>
        <Text style={styles.sectionTitle}> What Users Say</Text>
        <Testimonial
          name="Rafiul Islam"
          message="Smart Mess made our mess life super easy! Now no more fighting over calculation errors!"
        />
        <Testimonial
          name="Mim Jannat"
          message="The design is clean and easy to use. Tracking meals is just a click away!"
        />
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}> Frequently Asked Questions</Text>
        <Faq
          question="Is this platform free?"
          answer="Yes, Smart Mess is completely free to use for individuals and messes."
        />
        <Faq
          question="Can I use it on mobile?"
          answer="Absolutely! The app is fully responsive and works smoothly on phones and tablets."
        />
        <Faq
          question="Who can see the expense data?"
          answer="Only mess members and managers can view internal data securely."
        />
      </View>

      {/* CTA */}
      <LinearGradient
        colors={["#16a34a", "#22c55e"]}
        style={styles.ctaContainer}
      >
        <Text style={styles.ctaTitle}> Get Started Today!</Text>
        <Text style={styles.ctaText}>
          Join your mess or create one and simplify your mess life now.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.ctaButtonText}>Register Now</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
}

// Feature Card
const FeatureCard = ({ icon, color, title, description }) => (
  <View style={styles.featureCard}>
    <FontAwesome5 name={icon} size={32} color={color} style={{ marginBottom: 8 }} />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{description}</Text>
  </View>
);

// Info Card
const InfoCard = ({ step, title }) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoStep}>{step}</Text>
    <Text style={styles.infoTitle}>{title}</Text>
  </View>
);

// Testimonial
const Testimonial = ({ name, message }) => (
  <View style={styles.testimonialCard}>
    <FontAwesome5 name="quote-left" size={20} color="#14b8a6" style={{ marginBottom: 6 }} />
    <Text style={styles.testimonialText}>"{message}"</Text>
    <Text style={styles.testimonialName}>- {name}</Text>
  </View>
);

// FAQ
const Faq = ({ question, answer }) => (
  <View style={styles.faqCard}>
    <Text style={styles.faqQuestion}>❓ {question}</Text>
    <Text style={styles.faqAnswer}>{answer}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  heroContainer: {
    width: width,
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f766e",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroText: {
    fontSize: 16,
    color: "#065f46",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#065f46",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  featureCard: {
    width: width * 0.28,
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    textAlign: "center",
    color: "#4b5563",
  },
  infoCard: {
    width: width * 0.28,
    backgroundColor: "#dcfce7",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  infoStep: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#16a34a",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  testimonialCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  testimonialText: {
    fontStyle: "italic",
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
  },
  testimonialName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#065f46",
    textAlign: "right",
  },
  faqCard: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  faqQuestion: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#16a34a",
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: "#374151",
  },
  ctaContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  ctaText: {
    fontSize: 14,
    color: "#e5e7eb",
    textAlign: "center",
    marginVertical: 10,
    maxWidth: 280,
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 10,
  },
  ctaButtonText: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: 14,
  },
});
