import sys, urllib2, zipfile
from selenium import webdriver

# todo: fast proxy
# todo: mask request to make it look more like browser

def makeRequest(url, cookies):
    print "Making request..."
    opener = urllib2.build_opener()
    cookie_string = '; '.join(['%s=%s' % (item['name'], item['value']) for item in cookies])
    opener.addheaders.append(('Cookie', cookie_string))
    f = opener.open(url)
    filename = 'testfile_%s.zip' % ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(20))
    print "Finished opening URL. Writing file %s..." % filename
    with open(filename, 'wb') as local_file:
       local_file.write(f.read())
    print "Extracting file..."
    with zipfile.ZipFile(filename, 'r') as z:
        z.extractall()

def runSelenium(user_email, user_password):
    profile = webdriver.FirefoxProfile()
    #profile.set_preference('network.proxy.type', 1)
    #profile.set_preference('network.proxy.socks', '127.0.0.1')
    #profile.set_preference('network.proxy.socks_port', 9050)
    browser = webdriver.Firefox(profile)
    browser.get("https://www.23andme.com/user/signin")
    email_elt = browser.find_element_by_id("id_username")
    email_elt.send_keys(user_email)
    password_elt = browser.find_element_by_id("id_password")
    password_elt.send_keys(user_password)
    login_elt = browser.find_element_by_name("button")
    login_elt.click()
    browser.get("https://www.23andme.com/you/download")
    second_pass_elt = browser.find_element_by_name("password")
    second_pass_elt.send_keys(user_password)
    question_elts = browser.find_elements_by_class_name("form_region_exp")
    secret = None
    for elt in question_elts:
        if elt.text.startswith("Secret question:"):
            secret = raw_input(elt.text)
            break
    if not secret:
        print "No secret provided, exiting"
        sys.exit(1)
    secret_elt = browser.find_element_by_name("secret_answer")
    secret_elt.send_keys(secret)
    submit = browser.find_element_by_id("invite_submit")
    submit.click()
    link = browser.find_element_by_xpath('//div[@id="content"]//a')
    link_text = link.get_attribute("href")
    cookies = browser.get_cookies()
    browser.quit()
    return link_text, cookies

if len(sys.argv) == 3:
    email = sys.argv[1]
    passwd = sys.argv[2]
else:
    email = raw_input("Email: ")
    passwd = raw_input("Password: ") 

link, cookies = runSelenium(email, passwd)
makeRequest(link, cookies)
