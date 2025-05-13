import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const CustomizedCoverLetter = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [companyName, setCompanyName] = useState('this company');
  const [hiringManager, setHiringManager] = useState('[Name of Hiring Manager]');
  const [hiringManagerTitle, setHiringManagerTitle] = useState('Hiring Manager');
  const [hiringManagerContact, setHiringManagerContact] = useState('03123456789 [Contact of Hiring Manager]');
  const [hiringManagerEmail, setHiringManagerEmail] = useState('abc@gmail.com [Email of Hiring Manager]');
  const [hiringManagerAddress, setHiringManagerAddress] = useState('123 Anywhere St., Any City [address of Company]');
  const [loading, setLoading] = useState(true);
  const letterRef = useRef(null);
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJobData = () => {
      if (router.query.job) {
        try {
          const decoded = decodeURIComponent(router.query.job);
          const parsedJob = JSON.parse(decoded);
          // Set job-related fields from the parsed data
          if (parsedJob.name) setJobTitle(parsedJob.name);
          if (parsedJob.company) setCompanyName(parsedJob.company);
          setJob(parsedJob);
        } catch (error) {
          console.error("Failed to parse job data", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [router.query.job]);

  useEffect(() => {
    if (session && !loading) {
      fetch(`/api/getUser/${session.user.email}`)
        .then((response) => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.json();
        })
        .then((data) => {
          setUser(data);
          const generatedCoverLetter = generateCoverLetter(data);
          setCoverLetter(generatedCoverLetter);
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [session, loading]);

  const generateCoverLetter = (userData) => {
    const name = userData?.name ?? "Your Name";
  
    const educationItem = Array.isArray(userData?.education) ? userData.education[0] : null;
    const educationText = educationItem
      ? `${educationItem.degreeTitle ?? "your degree"} from ${educationItem.institute ?? "your institute"}`
      : "your educational background";
  
    const experienceItem = Array.isArray(userData?.experience) ? userData.experience[0] : null;
    const experienceText = experienceItem
      ? `${experienceItem.title ?? "your role"} for ${experienceItem.duration ?? "some time"}`
      : "relevant experience";
  
    const skills = Array.isArray(userData?.skills) ? userData.skills.join(", ") : "relevant skills";
    const email = userData?.email ?? "your.email@example.com";
    const phone = typeof userData?.contact === "string" ? userData.contact : "your phone number";
  
    return `Dear Hiring Manager,
  
I am writing to express my interest in the position of ${jobTitle} at ${companyName}. With a degree in ${educationText}, and significant experience as ${experienceText}, I believe I possess the skills and qualifications necessary to excel in this role.
  
As a professional with a strong background in ${skills}, I have developed a deep understanding of the demands of this field. I am confident that my technical expertise, coupled with my passion for the industry, will allow me to make a meaningful contribution to your team.
  
My contact details are as follows:
Email: ${email}
Phone: ${phone}
  
I am looking forward to discussing how my skills and experiences can benefit ${companyName}. Thank you for considering my application.
  
Sincerely,  
${name}`;
  };
  
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const updatedCoverLetter = generateCoverLetter(user);
    setCoverLetter(updatedCoverLetter);
    setIsEditing(false);
  };

  const handlePrint = () => {
    // Create a clone of the letter container
    const printContent = letterRef.current.cloneNode(true);
    
    // Remove any elements you don't want to print
    const controls = printContent.querySelector('.no-print');
    if (controls) controls.remove();
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Cover Letter</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none !important; }
              @page { margin: 0.5in; }
            }
            * {
              box-sizing: border-box;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div style={styles.pageContainer} className="no-print">
      <div style={styles.controls} className="no-print">
        <button onClick={handleEditToggle} style={styles.button} className="no-print">
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        {isEditing && (
          <button onClick={handleSave} style={{...styles.button, backgroundColor: '#4CAF50'}}>
            Save
          </button>
        )}
        <button onClick={handlePrint} style={{...styles.button, backgroundColor: '#2196F3'}}>
          Print
        </button>
      </div>

      <div style={styles.letterContainer} ref={letterRef}>
        {user && (
          <div style={styles.letterContent}>
            {/* Header Section */}
            <div style={styles.header}>
              <div style={styles.userInfo}>
                <h2 style={styles.userName}>{user?.name || "Your Name"}</h2>
                <div style={styles.contactInfo}>
                  <p>{user?.contact || "+123-456-7890"}</p>
                  <p>{user?.email || "your.email@example.com"}</p>
                  <p>{user?.address || "123 Anywhere St., Any City"}</p>
                </div>
              </div>
            </div>

            {/* Hiring Manager Section - Now Editable */}
            <div style={styles.hiringManagerSection}>
              <div style={styles.hiringManagerInfo}>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={hiringManager}
                      onChange={(e) => setHiringManager(e.target.value)}
                      style={{...styles.input, fontWeight: 'bold', fontSize: '16px', marginBottom: '5px'}}
                    />
                    <input
                      type="text"
                      value={hiringManagerTitle}
                      onChange={(e) => setHiringManagerTitle(e.target.value)}
                      style={{...styles.input, fontSize: '14px', marginBottom: '10px', color: '#555'}}
                      placeholder="Title"
                    />
                    <div style={styles.contactInfo}>
                      <input
                        type="text"
                        value={hiringManagerContact}
                        onChange={(e) => setHiringManagerContact(e.target.value)}
                        style={{...styles.input, fontSize: '14px'}}
                      />
                      <input
                        type="text"
                        value={hiringManagerEmail}
                        onChange={(e) => setHiringManagerEmail(e.target.value)}
                        style={{...styles.input, fontSize: '14px'}}
                      />
                      <input
                        type="text"
                        value={hiringManagerAddress}
                        onChange={(e) => setHiringManagerAddress(e.target.value)}
                        style={{...styles.input, fontSize: '14px'}}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p style={styles.hiringManagerName}>{hiringManager}</p>
                    <p style={styles.hiringManagerTitle}>{hiringManagerTitle}, {companyName}</p>
                    <div style={styles.contactInfo}>
                      <p>{hiringManagerContact}</p>
                      <p>{hiringManagerEmail}</p>
                      <p>{hiringManagerAddress}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Job Reference */}
            <div style={styles.jobReference}>
              <p>JOB REFERENCE: {jobTitle.toUpperCase()}</p>
            </div>

            {/* Cover Letter Content */}
            <div style={styles.letterBody}>
              {isEditing ? (
                <div style={styles.editSection}>
                  <div style={styles.formGroup}>
                    <label>Job Title:</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Company Name:</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label>Hiring Manager:</label>
                    <input
                      type="text"
                      value={hiringManager}
                      onChange={(e) => setHiringManager(e.target.value)}
                      style={styles.input}
                    />
                  </div>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    style={styles.textarea}
                    rows={15}
                  />
                </div>
              ) : (
                <div style={styles.letterText}>
                  {coverLetter.split('\n').map((paragraph, index) => (
                    <p key={index} style={styles.paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Styling
const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  controls: {
    marginBottom: '20px',
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  letterContainer: {
    width: '8.5in',
    minHeight: '11in',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    padding: '1in',
    position: 'relative',
  },
  letterContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  userInfo: {
    textAlign: 'left',
  },
  userName: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    color: '#333',
  },
  userTitle: {
    fontSize: '16px',
    margin: '0 0 10px 0',
    color: '#555',
  },
  contactInfo: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.4',
  },
  hiringManagerSection: {
    marginBottom: '30px',
  },
  hiringManagerInfo: {
    textAlign: 'left',
  },
  hiringManagerName: {
    fontSize: '16px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
  },
  hiringManagerTitle: {
    fontSize: '14px',
    margin: '0 0 10px 0',
    color: '#555',
  },
  jobReference: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  letterBody: {
    flex: 1,
  },
  letterText: {
    fontSize: '14px',
    lineHeight: '1.6',
    textAlign: 'left',
  },
  paragraph: {
    margin: '0 0 16px 0',
    textAlign: 'justify',
  },
  editSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.6',
    minHeight: '400px',
    resize: 'vertical',
  },
};

export default CustomizedCoverLetter;