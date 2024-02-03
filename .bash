# remove docker buildkit
alias dbuild="DOCKER_BUILDKIT=0 docker build ."
alias buildkit="docker build ."
alias compose="docker commit -c CMD 'redis-server' CONTAINERID"
