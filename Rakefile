require 'bundler/gem_helper'
Bundler::GemHelper.install_tasks

require 'rubocop/rake_task'
RuboCop::RakeTask.new

require 'rake/testtask'
Rake::TestTask.new do |t|
  t.libs << 'test'
  t.test_files = FileList['test/test*.rb']
  t.verbose = true
end

task :eslint do
  ok = system('eslint app/assets/javascript')
  abort('eslint failed!') unless ok
end

task default: :ci
task ci: [:test, :rubocop, :eslint]
