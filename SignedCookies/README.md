# Generate private key
openssl genrsa -out private_key.pem 2048

# Extract public key
openssl rsa -in private_key.pem -pubout -out public_key.pem

# To Store Key As Secret
with open('private_key.pem', 'r') as r:
    res = r.read()
formatted_res = res.replace("\n", "\\n")
print(formatted_res)