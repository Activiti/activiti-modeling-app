     //  sh "updatebot push-regex -r "\s+tag: (.*)" -v \$(cat VERSION) --previous-line "\s+repository: activiti/activiti-model" **/values.yaml) --merge false"
 pipeline {
    agent {
        label "jenkins-nodejs"
    }
    environment {
      ORG               = 'activiti'
      APP_NAME          = 'activiti-modeling-app'
      CHARTMUSEUM_CREDS = credentials('jenkins-x-chartmuseum')
      GITHUB_CHARTS_REPO    = "https://github.com/Activiti/activiti-cloud-helm-charts.git"
      GITHUB_HELM_REPO_URL = "https://activiti.github.io/activiti-cloud-helm-charts/"
      PREVIEW_VERSION = "0.0.0-SNAPSHOT-$BRANCH_NAME-$BUILD_NUMBER"
      NODE_OPTIONS = "--max_old_space_size=40000"
      OPTIMIZE_MEMORY = "true"
    }
    stages {
      stage('Prepare to run tests') {
        when {
          branch 'PR-*'
        }
        steps {
          container('nodejs') {
            sh "node --version"
            sh "npm --version"

            sh "Xvfb :99 &"
            sh "chown root /opt/google/chrome/chrome-sandbox"
            sh "chmod 4755 /opt/google/chrome/chrome-sandbox"

            sh "npm config set unsafe-perm true&& npm install"
          }
        }
      }
      stage ('Tests') {
        when {
          branch 'PR-*'
        }
        parallel {
               stage('E2E Tests') {
                  steps {
                    container('nodejs'){
                      echo "Run E2E Tests"
                      sh "npm run webdriver-update-ci"
                      sh "npm run e2e"
                    }
                  }
                }
                stage('Unit Tests && Build') {
                  steps {
                      container('nodejs'){
                        echo "Run Unit Tests && Build"
                        sh "npm run test:ci && npm run build:prod"
                      }
                  }
                }

        }
      }
      stage('Build Release') {
        when {
          branch 'master'
        }
        steps {
          container('nodejs') {
            // ensure we're not on a detached head
            sh "git checkout master"
            sh "git config --global credential.helper store"

            sh "jx step git credentials"
            // so we can retrieve the version in later steps
            sh "echo \$(jx-release-version) > VERSION"
            sh "npm install"
            sh "npm run build:prod"

            dir("./charts/$APP_NAME") {
              retry(5) {
                sh "make tag"
              }
            }
            sh 'export VERSION=`cat VERSION` && skaffold build -f skaffold.yaml'
            sh "jx step post build --image $DOCKER_REGISTRY/$ORG/$APP_NAME:\$(cat VERSION)"

          }
        }
      }
      stage('Promote') {
        when {
          branch 'master'
        }
        steps {
            container('nodejs') {
                // Run updatebot to update other repos
                sh './updatebot.sh'
            }
          }

      }
    }
    post {
        always {
            cleanWs()
        }
    }
}
